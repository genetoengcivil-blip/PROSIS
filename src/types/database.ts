export type ProjectStage = {
  id: string;
  project_id: string;
  agent_name: 'CPO' | 'DESIGNER' | 'CTO';
  sequence_order: number;
  title: string;
  output_content: any;
  is_completed: boolean;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: 'planning' | 'designing' | 'coding' | 'done';
  created_at: string;
};