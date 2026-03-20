import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { message, stageId, agentRole, history } = await req.json();

  // 1. Buscar Contexto Completo (Projeto + Estágio)
  const { data: stageData } = await supabase
    .from('project_stages')
    .select('*, projects(name, description)')
    .eq('id', stageId)
    .single();

  const projectName = stageData?.projects?.name || "Projeto Sem Nome";
  
  // 2. Personalizar o Prompt de Sistema com Contexto
  const basePrompt = `Você é o Agente ${agentRole} do sistema PROSIS. 
    Estamos trabalhando no projeto: "${projectName}".
    Seu objetivo atual é: "${stageData?.title}".
    Mantenha um tom profissional, consultivo e focado em criar um SaaS/App de alta performance. 
    Seja direto e guie o usuário passo a passo.`;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: basePrompt
  });

  try {
    // 3. Iniciar chat com histórico (Memória de Curto Prazo)
    const chat = model.startChat({
      history: history.map((m: any) => ({
        role: m.user_input ? "user" : "model",
        parts: [{ text: m.user_input || m.agent_output }],
      })),
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // 4. Salvar no Banco
    await supabase.from('agent_interactions').insert({
      project_stage_id: stageId,
      user_input: message,
      agent_output: responseText
    });

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro na IA" }, { status: 500 });
  }
}