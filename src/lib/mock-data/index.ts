/**
 * Dados mockados realistas do AlignedCV.
 * Empresas, vagas e candidato são fictícios.
 */

export const NOW_MS = 1755585600000; // referência fixa p/ datas mockadas

export interface MockJobRaw {
  id: string;
  title: string;
  company: string;
  logoInitials: string;
  location: string;
  isRemote: boolean;
  workModel: "Remoto" | "Híbrido" | "Presencial";
  seniority: "Júnior" | "Pleno" | "Sênior" | "Especialista" | "Estágio";
  salaryMin?: number;
  salaryMax?: number;
  contract: "CLT" | "PJ" | "Freelance" | "Estágio" | "Temporário";
  area: string;
  publishedDaysAgo: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  differentials: string[];
  keywords: string[];
  benefits: string[];
}

export const mockJobs: MockJobRaw[] = [
  {
    id: "job-tech-front-pleno",
    title: "Desenvolvedor Front-end Pleno",
    company: "Tech Solutions",
    logoInitials: "TS",
    location: "São Paulo — SP",
    isRemote: true,
    workModel: "Remoto",
    seniority: "Pleno",
    salaryMin: 9000,
    salaryMax: 13000,
    contract: "CLT",
    area: "Desenvolvimento de Software",
    publishedDaysAgo: 2,
    description:
      "Vamos evoluir nosso produto de gestão financeira usado por milhares de empresas. Você fará parte do time de produto, construindo interfaces rápidas e acessíveis com React e TypeScript, em um ambiente colaborativo com ciclos curtos de entrega.",
    responsibilities: [
      "Desenvolver e evoluir interfaces web com React, TypeScript e Tailwind CSS",
      "Consumir e integrar APIs REST de forma performática",
      "Escrever testes automatizados e participar de revisões de código",
      "Colaborar com design e produto em ciclos ágeis de entrega",
    ],
    requirements: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Git", "Consumo de APIs REST", "Testes automatizados"],
    differentials: ["Experiência em produtos SaaS", "Metodologias ágeis (Scrum/Kanban)", "Ferramentas de CI/CD", "React Query"],
    keywords: ["React", "TypeScript", "Tailwind", "APIs REST", "testes automatizados", "Git", "Scrum", "SaaS"],
    benefits: ["Plano de saúde", "Vale alimentação", "Budget anual para cursos", "2 dias por semana de home office"],
  },
  {
    id: "job-nimbus-react",
    title: "Desenvolvedor React",
    company: "Nimbus Digital",
    logoInitials: "ND",
    location: "100% Remoto",
    isRemote: true,
    workModel: "Remoto",
    seniority: "Pleno",
    salaryMin: 10000,
    salaryMax: 14000,
    contract: "PJ",
    area: "Desenvolvimento de Software",
    publishedDaysAgo: 4,
    description:
      "A Nimbus Digital constrói plataformas de e-commerce headless para grandes varejistas. Buscamos uma pessoa desenvolvedora React apaixonada por interfaces de alta performance e boa experiência de usuário.",
    responsibilities: [
      "Desenvolver interfaces de e-commerce com React e Next.js",
      "Otimizar performance e Core Web Vitals das lojas",
      "Criar componentes reutilizáveis com Storybook",
      "Integrar headless CMS e APIs REST",
    ],
    requirements: ["React", "Next.js", "TypeScript", "HTML", "CSS", "Git"],
    differentials: ["Core Web Vitals", "Storybook", "Testes E2E", "Figma"],
    keywords: ["React", "Next.js", "TypeScript", "performance", "Storybook", "Git", "e-commerce"],
    benefits: ["100% remoto", "Horário flexível", "Auxílio home office", "Inglês patrocinado"],
  },
  {
    id: "job-meridian-swe",
    title: "Software Engineer",
    company: "Meridian Labs",
    logoInitials: "ML",
    location: "Florianópolis — SC",
    isRemote: false,
    workModel: "Híbrido",
    seniority: "Sênior",
    salaryMin: 16000,
    salaryMax: 22000,
    contract: "CLT",
    area: "Desenvolvimento de Software",
    publishedDaysAgo: 6,
    description:
      "Time de engenharia que construiu a principal plataforma de observabilidade do país. Você vai desenhar arquitetura, guiar decisões técnicas e atuar como referência do produto.",
    responsibilities: [
      "Desenhar e evoluir arquitetura de software distribuído",
      "Desenvolver com Node.js, TypeScript e React",
      "Colocar serviços em produção com Docker e AWS",
      "Mentorar pessoas desenvolvedoras em início de carreira",
    ],
    requirements: ["React", "Node.js", "TypeScript", "Docker", "AWS", "PostgreSQL"],
    differentials: ["Kubernetes", "Observabilidade", "Arquitetura distribuída", "LLMs"],
    keywords: ["Node.js", "TypeScript", "Docker", "AWS", "PostgreSQL", "arquitetura", "React"],
    benefits: ["Plano de saúde premium", "Participação nos resultados", "4 semanas de trabalho remoto por ano"],
  },
  {
    id: "job-vertex-fullstack",
    title: "Desenvolvedor Full Stack",
    company: "Vertex Systems",
    logoInitials: "VS",
    location: "Belo Horizonte — MG",
    isRemote: false,
    workModel: "Híbrido",
    seniority: "Pleno",
    salaryMin: 11000,
    salaryMax: 15000,
    contract: "CLT",
    area: "Desenvolvimento de Software",
    publishedDaysAgo: 1,
    description:
      "Sistema de logística em crescimento acelerado. Buscamos full stack para atuar do banco ao front, com Node.js, PostgreSQL e React, sempre pautado por testes.",
    responsibilities: [
      "Desenvolver features ponta a ponta (API + interface)",
      "Modelar dados com PostgreSQL e Node.js",
      "Automatizar deploys com Docker e CI/CD",
      "Participar de rituais ágeis do time",
    ],
    requirements: ["Node.js", "React", "TypeScript", "PostgreSQL", "Docker", "Git"],
    differentials: ["CI/CD", "Redis", "Metodologias ágeis", "Experiência com logística"],
    keywords: ["Node.js", "React", "TypeScript", "PostgreSQL", "Docker", "CI/CD", "Git"],
    benefits: ["Vale alimentação", "Plano de saúde", "Gympass"],
  },
  {
    id: "job-orbit-node",
    title: "Desenvolvedor Node.js",
    company: "Orbita Pay",
    logoInitials: "OP",
    location: "100% Remoto",
    isRemote: true,
    workModel: "Remoto",
    seniority: "Pleno",
    salaryMin: 12000,
    salaryMax: 16000,
    contract: "PJ",
    area: "Desenvolvimento de Software",
    publishedDaysAgo: 3,
    description:
      "Fintech de pagamentos em expansão. Nosso time de engenharia é 100% remoto, com foco em Node.js, TypeScript e confiabilidade.",
    responsibilities: [
      "Construir APIs REST escaláveis com Node.js e TypeScript",
      "Integrar provedores de pagamento e webhooks",
      "Escrever testes de integração e monitorar produção",
    ],
    requirements: ["Node.js", "TypeScript", "APIs REST", "Testes automatizados", "PostgreSQL"],
    differentials: ["Fintech", "Redis", "Kafka", "Observabilidade"],
    keywords: ["Node.js", "TypeScript", "API REST", "testes", "PostgreSQL", "fintech"],
    benefits: ["100% remoto", "Stock options", "Plano de saúde"],
  },
  {
    id: "job-lumina-uxui",
    title: "UX/UI Designer",
    company: "Lumina Studio",
    logoInitials: "LS",
    location: "Curitiba — PR",
    isRemote: false,
    workModel: "Híbrido",
    seniority: "Pleno",
    salaryMin: 8000,
    salaryMax: 11000,
    contract: "CLT",
    area: "Design",
    publishedDaysAgo: 5,
    description:
      "Estúdio de design digital focado em produtos B2B. Buscamos UX/UI Designer para conduzir descobertas com usuários e criar interfaces acessíveis.",
    responsibilities: [
      "Conduzir descobertas e pesquisas com usuários",
      "Criar fluxos e protótipos de alta fidelidade",
      "Manter design system com componentes consistentes",
    ],
    requirements: ["Figma", "Design System", "Prototipação", "Pesquisa com usuários", "Acessibilidade"],
    differentials: ["Experiência com B2B", "Motion design", "HTML e CSS"],
    keywords: ["Figma", "design system", "protótipos", "acessibilidade", "pesquisa com usuários"],
    benefits: ["Horário flexível", "Plano de saúde", "Home office parcial"],
  },
  {
    id: "job-atlas-product-designer",
    title: "Product Designer",
    company: "Atlas Educação",
    logoInitials: "AE",
    location: "100% Remoto",
    isRemote: true,
    workModel: "Remoto",
    seniority: "Sênior",
    salaryMin: 12000,
    salaryMax: 16000,
    contract: "CLT",
    area: "Design",
    publishedDaysAgo: 8,
    description:
      "Plataforma de ensino online com milhões de estudantes. Buscamos Product Designer para atuar na evolução da experiência mobile.",
    responsibilities: [
      "Desenhar experiências de ponta a ponta para mobile",
      "Colaborar com engenharia na implementação",
      "Definir e acompanhar métricas de UX",
    ],
    requirements: ["Figma", "Design System", "UX Writing", "Pesquisa com usuários"],
    differentials: ["Experiência com apps", "Design tokens"],
    keywords: ["Figma", "design system", "mobile", "UX", "métricas"],
    benefits: ["100% remoto", "Plano de saúde", "Plataforma de cursos gratuita"],
  },
  {
    id: "job-delta-analista",
    title: "Analista de Sistemas",
    company: "Delta Corp",
    logoInitials: "DC",
    location: "Porto Alegre — RS",
    isRemote: false,
    workModel: "Presencial",
    seniority: "Júnior",
    salaryMin: 4500,
    salaryMax: 6500,
    contract: "CLT",
    area: "Análise de Sistemas",
    publishedDaysAgo: 10,
    description:
      "Análise de sistemas e suporte a aplicações internas, com foco em melhorias de processos e requisitos de negócio.",
    responsibilities: [
      "Levantar requisitos com as áreas de negócio",
      "Elaborar documentação técnica",
      "Apoiar testes e validações de sistemas",
    ],
    requirements: ["Análise de requisitos", "SQL", "Documentação técnica"],
    differentials: ["Power BI", "ITIL"],
    keywords: ["análise de requisitos", "SQL", "documentação"],
    benefits: ["Vale alimentação", "Plano de saúde"],
  },
  {
    id: "job-polaris-intern",
    title: "Estágio — Desenvolvimento Web",
    company: "Polaris Tech",
    logoInitials: "PT",
    location: "Recife — PE",
    isRemote: false,
    workModel: "Presencial",
    seniority: "Estágio",
    salaryMin: 1600,
    salaryMax: 2200,
    contract: "Estágio",
    area: "Desenvolvimento de Software",
    publishedDaysAgo: 7,
    description:
      "Programa de estágio em desenvolvimento web com mentoria dedicada e trilha de aprendizado em React e Node.js.",
    responsibilities: [
      "Aprender e apoiar o time em tarefas técnicas",
      "Participar de code reviews com mentoria",
      "Desenvolver pequenas features com supervisão",
    ],
    requirements: ["HTML", "CSS", "JavaScript", "Git"],
    differentials: ["React", "Inglês intermediário"],
    keywords: ["HTML", "CSS", "JavaScript", "Git", "React"],
    benefits: ["Bolsa-auxílio", "Vale-transporte", "Mentoria técnica"],
  },
  {
    id: "job-quantum-senior",
    title: "Desenvolvedor Front-end Sênior",
    company: "Quantum Analytics",
    logoInitials: "QA",
    location: "100% Remoto",
    isRemote: true,
    workModel: "Remoto",
    seniority: "Sênior",
    salaryMin: 18000,
    salaryMax: 24000,
    contract: "PJ",
    area: "Desenvolvimento de Software",
    publishedDaysAgo: 12,
    description:
      "Dashboards analíticos em tempo real para grandes clientes. Buscamos referência técnica em front-end para evoluir arquitetura, performance e mentorias.",
    responsibilities: [
      "Evoluir a arquitetura do front-end",
      "Garantir performance e acessibilidade",
      "Mentorar pessoas desenvolvedoras",
    ],
    requirements: ["React", "TypeScript", "Arquitetura de front-end", "Testes automatizados", "Performance"],
    differentials: ["Data visualization", "WebSockets", "Design system"],
    keywords: ["React", "TypeScript", "arquitetura", "performance", "testes", "dashboards"],
    benefits: ["100% remoto", "Horário flexível", "Notebook de alta performance"],
  },
];

// ─── Candidato fictício (demo) ─────────────────────────────────────

export const mockCandidateBaseResume = {
  id: "resume-base",
  name: "Currículo Principal",
  isBase: true,
  personal: {
    name: "Ana Ribeiro Alves",
    title: "Desenvolvedora Front-end",
    email: "ana.ribeiro@email.com",
    phone: "+55 11 98765-4321",
    location: "São Paulo — SP",
    linkedin: "linkedin.com/in/anaribeiro",
    github: "github.com/anaribeiro",
    portfolio: "anaribeiro.dev",
  },
  summary:
    "Desenvolvedora front-end com 5 anos de experiência em aplicações web com React e TypeScript. Foco em performance, acessibilidade e componentização. Já contribuí para produtos SaaS com milhares de usuários ativos.",
  experiences: [
    {
      id: "exp-1",
      company: "Cloudia Software",
      role: "Desenvolvedora Front-end Pleno",
      period: "2022 — atual",
      location: "São Paulo — SP",
      description:
        "Desenvolvimento de módulos do produto SaaS de gestão em React e TypeScript, com integração de APIs REST e foco em performance.",
      achievements: [
        "Reduzi o tempo de carregamento do produto em 40% com code splitting e lazy loading",
        "Implementei testes automatizados que elevaram a cobertura de 30% para 80%",
      ],
      skills: ["React", "TypeScript", "Tailwind CSS", "REST APIs", "Jest"],
    },
    {
      id: "exp-2",
      company: "Pixel Forge",
      role: "Desenvolvedora Front-end Júnior",
      period: "2020 — 2022",
      location: "São Paulo — SP",
      description:
        "Criação de landing pages e painéis administrativos em JavaScript e React, atendendo clientes de e-commerce.",
      achievements: [
        "Entreguei mais de 15 projetos web com nota média de satisfação 4,8/5",
      ],
      skills: ["JavaScript", "React", "HTML", "CSS", "Sass"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Universidade de São Paulo (USP)",
      course: "Bacharelado em Sistemas de Informação",
      period: "2017 — 2021",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Node.js",
    "Git",
    "REST APIs",
    "Jest",
    "Figma",
    "Scrum",
    "Metodologias ágeis",
    "Acessibilidade",
  ],
  certifications: [
    {
      id: "cert-1",
      name: "React Avançado",
      issuer: "Origamid",
      year: "2023",
    },
    {
      id: "cert-2",
      name: "Acessibilidade Web (WCAG)",
      issuer: " cursos.dev",
      year: "2024",
    },
  ],
  languages: [
    { id: "lang-1", name: "Português", level: "Nativo" as const },
    { id: "lang-2", name: "Inglês", level: "Avançado" as const },
    { id: "lang-3", name: "Espanhol", level: "Intermediário" as const },
  ],
  projects: [
    {
      id: "proj-1",
      name: "DevBoard",
      description:
        "Painel open-source de gestão de tarefas com React e TypeScript, com mais de 300 estrelas no GitHub.",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      link: "github.com/anaribeiro/devboard",
    },
  ],
};

import type { Job, Resume } from "@/types";

/** Converte vaga mockada (dias) para o modelo Job com data ISO */
export function toJob(raw: MockJobRaw): Job {
  const publishedAt = new Date(
    NOW_MS - raw.publishedDaysAgo * 86400000,
  ).toISOString();
  const { publishedDaysAgo: _ignored, ...rest } = raw;
  return { ...rest, publishedAt };
}

export const mockJobList: Job[] = mockJobs.map(toJob);

/** Currículo base fictício com timestamps (cópia profunda) */
export function buildDemoResume(now = Date.now()): Resume {
  return {
    ...mockCandidateBaseResume,
    updatedAt: now,
    experiences: mockCandidateBaseResume.experiences.map((e) => ({
      ...e,
      achievements: [...e.achievements],
      skills: [...e.skills],
    })),
    education: mockCandidateBaseResume.education.map((e) => ({ ...e })),
    certifications: mockCandidateBaseResume.certifications.map((c) => ({ ...c })),
    languages: mockCandidateBaseResume.languages.map((l) => ({ ...l })),
    projects: mockCandidateBaseResume.projects.map((p) => ({
      ...p,
      skills: [...p.skills],
    })),
    skills: [...mockCandidateBaseResume.skills],
  };
}

