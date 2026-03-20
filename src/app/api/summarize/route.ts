import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { stageId, history } = await req.json();

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Você é um sintetizador de reuniões. Seu objetivo é resumir as principais decisões tomadas no chat em apenas 2 ou 3 frases curtas e diretas. Foque no que foi definido."
  });

  try {
    const chatContent = history.map((m: any) => `User: ${m.user_input}\nAgent: ${m.agent_output}`).join("\n\n");
    const result = await model.generateContent(`Resuma as definições desta conversa:\n\n${chatContent}`);
    const summary = result.response.text();

    // Salva o resumo no banco de dados
    await supabase
      .from('project_stages')
      .update({ output_content: { summary } })
      .eq('id', stageId);

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao resumir" }, { status: 500 });
  }
}