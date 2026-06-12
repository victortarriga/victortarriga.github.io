import { useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Calendar, Award, Users, Star,
  Sun, Moon, Menu, X, Download, Copy, Check,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { jsPDF } from 'jspdf'

// ============================================================
// FOTO DE PERFIL: coloque sua foto em /public/foto.jpg
// e mude PROFILE_PHOTO = "/foto.jpg"
// ============================================================
const PROFILE_PHOTO = "/foto.jpg"

// ─── Data ────────────────────────────────────────────────────────────────────

const kpis: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: '20+', label: 'Anos de Experiência', Icon: Calendar },
  { value: '29',  label: 'Certificações',       Icon: Award    },
  { value: '15K+', label: 'Seguidores LinkedIn', Icon: Users    },
  { value: '7',   label: 'Recomendações',       Icon: Star     },
]

const targetRoles = [
  'Squad Leader',
  'Scrum Master',
  'Technical Product Owner',
  'Delivery Manager',
  'Product Analyst Sênior',
]

const experiences = [
  {
    role: 'Squad Leader | QA | Scrum Master',
    company: 'Grupo OTG',
    period: '2022 — atual · Tempo integral',
    current: true,
    compact: false,
    badge: null as string | null,
    bullets: [
      'Squad Leader / QA — Projetos, Inovação & Tecnologia',
      'Responsável pelo time ágil, priorizando e entregando os backlogs de diferentes projetos do Grupo OTG',
      'Atuo assistindo e capacitando o Gaming para assumir e manter o compliance das normas de conformidade, junto ao time de desenvolvimento',
      'Foco e Resultado: Gaming 3.0 é hoje um dos melhores produtos de gaming do Brasil',
      'Scrum Master — Definição e Automação de Processos (co-criação)',
      '73 premiações de produtos de destaque do Grupo OTG',
    ],
  },
  {
    role: 'Product Owner Sênior',
    company: 'Dexco',
    period: 'set/2022 — ago/2025 · 3 anos',
    current: false,
    compact: false,
    badge: 'Terceirizado · Híbrido',
    bullets: [
      'PO Sênior dos e-commerces da Deca, Casttelato, Portinari, Durafloor, Duratex, Hudra e Ceusa',
      '48 mil tickets gerenciados · Portfolio de R$26M+ em projetos',
      'Garante mais de 12M de visitas/mês nos e-commerces',
      'Responsável por 30% do crescimento do faturamento digital da Deca, Portinari e Ceusa',
      'Introduziu kanban e rituais de 30 min/semana por área para transparência de pedidos',
      'Metodologia: Scrum · VTEX · Agile',
    ],
  },
  {
    role: 'Startup Specialist / Tech Recruiter',
    company: 'e-volve.in',
    period: '02/2021 — atual · Tempo integral',
    current: false,
    compact: false,
    badge: null as string | null,
    bullets: [
      'Especialista em startups com atuação no Brasil, EUA e Europa',
      'Atração e seleção dos melhores profissionais de tecnologia',
    ],
  },
  {
    role: 'Angel Investor',
    company: 'e-volve.ac Aceleradora',
    period: '02/2021 — atual',
    current: false,
    compact: false,
    badge: null as string | null,
    bullets: [
      'Apoio desde captação de investimento até estruturação de times-chave',
      'Mentor e conselheiro estratégico de startups em fase de aceleração',
      'Avaliação de oportunidades de investimento e acompanhamento de portfólio',
    ],
  },
  {
    role: 'Mentor de Startups | Business Advisor | Legal Advisor',
    company: 'Autônomo',
    period: 'out/2018 — atual',
    current: false,
    compact: false,
    badge: null as string | null,
    bullets: [
      'Ajudando startups de todos os setores a se estruturar e gerar valor',
      'Implantação de projetos de forma estratégica',
    ],
  },
  {
    role: 'Analista de Inovações (Product Owner)',
    company: 'Restoque S/A',
    period: 'fev/2020 — abr/2020 · (COVID-19)',
    current: false,
    compact: false,
    badge: null as string | null,
    bullets: [
      'PO em times ágeis com Scrum: backlog, user stories e critérios de aceite',
      'Condução das cerimônias: Planning, Daily, Review, Retrospectiva',
      'Homologação de entregas e status report',
      'Criação de dashboards, roadmaps e análise de métricas',
      'Design Thinking, Discovery e Inception com times de UX',
      '10 áreas de produto',
    ],
  },
  {
    role: 'Promotor de Produtos',
    company: 'Porto Seguro',
    period: 'dez/2020 — fev/2021',
    current: false,
    compact: false,
    badge: null as string | null,
    bullets: [
      'Promoção e comercialização de produtos e serviços',
      'Relacionamento com clientes e parceiros estratégicos',
    ],
  },
  {
    role: 'Analista Contábil',
    company: 'C Castellar Contabilidade',
    period: 'jan/2017 — set/2018 · 1 ano e 9 meses',
    current: false,
    compact: false,
    badge: null as string | null,
    bullets: [
      'Registros contábeis e conciliações',
      'Balancetes e demonstrativos',
      'Emissão de notas, apuração de impostos e obrigações acessórias',
    ],
  },
  {
    role: 'Assistente Contábil',
    company: 'Unihosp Saúde',
    period: 'abr/2014 — fev/2016 · 1 ano e 11 meses',
    current: false,
    compact: false,
    badge: null as string | null,
    bullets: [
      'Gestão de licenças especiais na área da saúde',
      'Vigilância sanitária, alvarás, certidões',
      'Atendimento à auditoria interna e externa',
    ],
  },
  {
    role: 'Auxiliar',
    company: 'Yalazu Serviços',
    period: 'fev/2005 — dez/2013 · 8 anos e 11 meses',
    current: false,
    compact: true,
    badge: null as string | null,
    bullets: [
      'Coordenação da equipe paralegal em escopo jurídico e financeiro',
    ],
  },
]

const education = [
  { degree: 'Análise e Desenvolvimento de Sistemas', school: 'Faculdade Impacta Tecnologia', period: '2019 — 2021' },
  { degree: 'Ciências Contábeis', school: 'Anhanguera Educacional', period: '2015 — 2019' },
  { degree: 'CST, Music Performance, General', school: 'Fundação das Artes de São Caetano do Sul', period: 'jan/2010 — em andamento' },
]


const skillGroups = [
  { label: 'Metodologias & Gestão', skills: ['Scrum', 'Kanban', 'Design Thinking', 'ITIL', 'DevOps', 'OKRs', 'PMBOK', 'Lean', 'PDCA'] },
  { label: 'Produto & Liderança', skills: ['Product Owner', 'Squad Leader', 'Scrum Master', 'Delivery Manager', 'Backlog', 'User Stories', 'Roadmap', 'KPIs', 'Dashboards'] },
  { label: 'Tecnologia & Ferramentas', skills: ['Azure DevOps', 'GitHub', 'VTEX', 'SAP', 'React', 'TypeScript', 'Vite', 'Supabase', 'SQL', 'Python', 'Google Analytics'] },
]

const certifications = [
  { name: 'Certified Scrum Product Owner® (CSPO)',       issuer: 'Scrum Alliance',  year: 'dez/2025'  },
  { name: 'Artificial Intelligence Fundamentals',         issuer: 'IBM',             year: 'set/2024'  },
  { name: 'CC50: Ciência da Computação (Harvard)',        issuer: 'Fundação Bradesco',year: '—'         },
  { name: 'DevOps Essentials Professional (DEPC)',        issuer: 'CertiProf',       year: '2020'      },
  { name: 'Kanban Foundation (KMP)™',                    issuer: 'CertiProf',       year: '2020'      },
  { name: 'Design Thinking: Foundational Skills',        issuer: 'IDEO',            year: 'mar/2020'  },
  { name: 'Workflow Specialist Certificate',             issuer: 'Asana',           year: '—'         },
  { name: 'Scrum Foundation Professional Certificate',   issuer: 'CertiProf',       year: '2020'      },
  { name: 'Agile Project Management',                    issuer: 'Mackenzie',       year: '2020'      },
  { name: 'Google Analytics para Iniciantes',            issuer: 'Google',          year: '2020'      },
  { name: 'Fundamentos de ITIL',                         issuer: 'Fundação Bradesco',year: '2020'     },
  { name: 'Product Masterclass: Build Digital Products', issuer: 'Product School',  year: '2020'      },
  { name: 'Scrum Fundamentals Certified',                issuer: 'SCRUMstudy',      year: '2020'      },
  { name: 'DevOps & Agile Culture',                      issuer: 'FIAP',            year: 'mar/2021'  },
  { name: 'Formando Campeões: Liderança F.C.',           issuer: 'Laje / League',   year: '2024'      },
  { name: 'Design Thinking',                             issuer: 'Udemy',           year: 'ago/2022'  },
  { name: 'Certificação Scrum Master',                   issuer: 'Udemy',           year: '—'         },
  { name: 'Gestão Ágil com Scrum',                       issuer: 'Udemy',           year: '—'         },
  { name: 'OKR: Metodologia e Aplicação',                issuer: 'Udemy',           year: '—'         },
  { name: 'Fundamentos Básicos do SAP',                  issuer: 'Udemy',           year: '—'         },
  { name: 'Inteligência Emocional',                      issuer: 'everlearn',       year: '—'         },
  { name: 'Conceitos e Características dos Projetos',    issuer: 'FGV',             year: '—'         },
  { name: 'Fundamentos da Gestão de TI',                 issuer: 'FGV',             year: '—'         },
  { name: 'Estratégia Corporativa e Gest. de Projetos',  issuer: 'Mackenzie',       year: '—'         },
  { name: 'Produtos Digitais',                           issuer: 'Tera',            year: '—'         },
  { name: 'Competências Profissionais e Tecnológicas',   issuer: 'PUCRS',           year: '—'         },
  { name: 'Marketing em Mídias Sociais',                 issuer: 'HP LIFE',         year: '—'         },
  { name: 'Gestão de Relacionamento com Clientes',       issuer: 'HP LIFE',         year: '—'         },
  { name: 'CertiProf Continuous Learner',                issuer: 'CertiProf',       year: '—'         },
]
const CERT_PAGES = Math.ceil(certifications.length / 6)

const recommendations = [
  {
    name: 'Juan Firmino Ribeiro',
    role: 'Product Manager Sênior | Gerente de E-commerce VTEX',
    relation: 'Trabalharam na Dexco · fev/2025',
    linkedinUrl: 'https://www.linkedin.com/in/juanfirminoribeiro/',
    photo: '/rec/juan.jpg',
    initials: 'JF',
    text: 'Trabalhar com o Victor na Dexco foi uma experiência incrível. Além de ser um profissional extremamente qualificado, ele sempre foi um parceiro de trabalho com quem pude contar. Como Product Owner na área de tech, ele foi essencial para a sustentação, principalmente na frente de conteúdo, garantindo que os processos corressem de forma fluida e que as melhorias fossem implementadas com estratégia e eficiência. O Victor tem um olhar analítico e um conhecimento profundo sobre o negócio, tecnologia e VTEX, o que fazia toda a diferença no dia a dia, sempre zelando por processos e metodologias ágeis, como Scrum. Ele sabia traduzir as necessidades do time com soluções viáveis e com uma abordagem estruturada. Além disso, sua habilidade em conectar diferentes áreas e facilitar a comunicação entre stakeholders e a agência de desenvolvimento foi um diferencial enorme, fez com que muitas melhorias fossem implementadas sem necessidade de correção. Sem dúvida, é alguém que agrega valor a qualquer equipe e entrega com excelência. Recomendo fortemente!',
  },
  {
    name: 'Bruno Bonacini',
    role: 'Squad Leader | Product Owner | VTEX | E-commerce',
    relation: 'Trabalharam juntos na Dexco · ~2 anos · fev/2025',
    linkedinUrl: 'https://www.linkedin.com/in/bruno-bonacini-9a45787a/',
    photo: '/rec/bruno.jpg',
    initials: 'BB',
    text: 'Tive o prazer de trabalhar junto ao Victor durante aproximadamente 2 anos. E nesse período, é notável seu vasto conhecimento técnico, não só na área de TI mas também na gestão de produtos. Durante esses 2 anos, compartilhamos de muitos conhecimentos, metodologia, e trocas extremamente produtivas no dia a dia. Apesar de estarmos em empresas diferentes, sempre buscamos o mesmo objetivo: Entregar um produto de muito sucesso à Dexco. O senso de solução de problemas combinado com a empatia com o time técnico, com certeza é um grande diferencial do Victor! Sua comunicação é clara e objetiva, com todo seu embasamento técnico. Parabéns pelo profissional que és Victor, desejo a você muito sucesso em sua jornada!',
  },
  {
    name: 'Esdras Scaramuzza Padial',
    role: 'International Expansion & Startup Specialist · e-volve',
    relation: 'Gestor direto de Victor · dez/2024',
    linkedinUrl: 'https://www.linkedin.com/in/esdrasscaramuzzapadial/',
    photo: '/rec/esdras.jpg',
    initials: 'ES',
    text: 'Prazer enorme em ter trabalhado com o Victor! Fui gestor do Victor por mais de um ano e, apesar de nunca ter feito o que a empresa fazia, teve um ótimo desenvolvimento, organizado, ajudou em várias questões da empresa. O Victor é parceiro, honesto e autêntico que fala suas ideias. Isso surpreendeu a todos e com pouco tempo de empresa, assim que expressou suas ideias pela primeira vez já gerou grandes mudanças! Por esta postura ativa, o Victor ganhou notoriedade em seus comentários e confiança de toda a gestão da empresa. Temos hoje uma geração anêmica frente aos problemas em geral e o Victor destoa disto. Obrigado Vitão, foi um prazer. Espero que os caminhos se cruzem novamente em algum momento.',
  },
  {
    name: 'Leticia Marques',
    role: 'Analista de Marketing Digital | Planejamento de Campanhas | Branding',
    relation: 'Trabalharam juntos na Dexco · nov/2024',
    linkedinUrl: 'https://www.linkedin.com/in/leticia-marques-0373a315a/',
    photo: '/rec/leticia.jpg',
    initials: 'LM',
    text: 'O Victor é o P.O ideal para qualquer equipe. Durante o tempo em que trabalhamos juntos, ele sempre demonstrou uma compreensão profunda das necessidades da área de negócios que eu demandava junto com a equipe e mantendo um equilíbrio com o time de tecnologia, entendendo o que pode ser feito. Ele busca entender a fundo as demandas e se empenha em facilitar o dia a dia, garantindo que os objetivos sejam alcançados com eficiência. Ele tem um sólido conhecimento da VTEX e grande domínio técnico da ferramenta, Victor se destaca pela agilidade e habilidade em encontrar soluções rápidas e eficazes — algo essencial no universo do e-commerce.',
  },
  {
    name: 'Mariana Molino',
    role: 'Experiência do Cliente (CX) | UX & Jornada do cliente | CRM & Growth',
    relation: 'Mesma equipe na Deca/Dexco · fev/2024',
    linkedinUrl: 'https://www.linkedin.com/in/mariana-molino-068134144/',
    photo: '/rec/mariana.jpg',
    initials: 'MM',
    text: 'Trabalho em parceria com o Vi no setor de E-commerce B2B2C da Deca, e posso afirmar que, como Product Owner de TI, ele se destaca por sua notável capacidade analítica. É habilidoso em examinar, entender e interpretar informações de maneira detalhada e sistemática, tornando fácil a compreensão dos desafios técnicos. Sua competência vai além do aspecto técnico, abrangendo uma compreensão lógica de negócios relacionados aos projetos e suas aplicações no contexto do e-commerce. Ele não apenas domina a plataforma VTEX, mas também responde de maneira ágil às demandas emergentes. No ambiente de equipe, Vi é reconhecido por sua colaboração constante, promovendo um espaço respeitoso e cooperativo. Trabalhar com o Victor torna o dia a dia não apenas mais fácil, mas também agradável.',
  },
  {
    name: 'Philip Scheer',
    role: 'Gerente de Tecnologia | Arquiteto de Soluções | Produtos Digitais',
    relation: 'Gestor direto de Victor · out/2022',
    linkedinUrl: 'https://www.linkedin.com/in/philip-scheer-52752218/',
    photo: '/rec/philip.jpg',
    initials: 'PS',
    text: 'Victor sempre foi um profissional inteligente, dedicado e resiliente. Nos projetos que trabalhamos, sempre se esforçou para entregar o melhor produto aos clientes, sendo proativo e mostrando ter conhecimento ímpar sobre o que era discutido e criado. Assumindo desafios com a cabeça erguida e ajudando seus colegas em diversas situações. É uma pessoa que se importa com todos e sempre busca o melhor para cada um. Muito fácil de se trabalhar no dia a dia, sabe trabalhar em equipe e gerenciar a mesma de uma forma natural. É um profissional fantástico para qualquer time!',
  },
  {
    name: 'Fabio Campos, KMP, Certified SAFe® 6 Agilist',
    role: 'Agilista | Analista de Negócios & Requisitos TI | Professor FIAP',
    relation: 'Mesma equipe · jun/2020',
    linkedinUrl: 'https://www.linkedin.com/in/fabio-campos-07429221/',
    photo: '/rec/fabio.jpg',
    initials: 'FC',
    text: 'Victor é um profissional de extrema competência que faz da qualidade uma de suas principais características. Atendendo aos prazos e mínimos detalhes, sempre se preocupou em ir além e superar quaisquer expectativas. Dedicado e inteligente, possui uma excelente capacidade de arguição, além de visão estratégica e habilidades excelentes para trabalhar em grupo!',
  },
]

const navLinks = [
  { href: '#sobre',        label: 'Sobre'          },
  { href: '#experiencia',  label: 'Experiência'    },
  { href: '#formacao',     label: 'Formação'       },
  { href: '#skills',       label: 'Habilidades'    },
  { href: '#certificacoes',label: 'Certificações'  },
  { href: '#recomendacoes',label: 'Recomendações'  },
]

const SECTION_IDS = navLinks.map(l => l.href.slice(1))

// ─── PDF Generator ───────────────────────────────────────────────────────────

function downloadCV() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const ml = 18
  const mr = 18
  const cw = W - ml - mr
  const pageH = 285
  let y = 0

  const checkPage = (needed = 8) => {
    if (y + needed > pageH) { doc.addPage(); y = 18 }
  }

  type Style = 'normal' | 'bold'
  const txt = (text: string, size: number, style: Style = 'normal', hex = '#1a1a1a') => {
    doc.setFontSize(size)
    doc.setFont('helvetica', style)
    doc.setTextColor(hex)
    const lines = doc.splitTextToSize(text, cw) as string[]
    checkPage(lines.length * size * 0.37)
    doc.text(lines, ml, y)
    y += lines.length * size * 0.37
  }

  const gap = (n = 2) => { y += n }

  const rule = () => {
    gap(2)
    doc.setDrawColor(210, 210, 210)
    doc.line(ml, y, W - mr, y)
    gap(4)
  }

  const section = (title: string) => {
    checkPage(14)
    rule()
    txt(title, 8, 'bold', '#888888')
    gap(2)
  }

  // ── Header ──
  y = 20
  txt('VICTOR HUGO TARRIGA GOMES', 17, 'bold', '#111111')
  gap(1)
  txt('Squad Leader · Scrum Master · Product Owner Sênior', 10, 'normal', '#555555')
  gap(1)
  txt('Grupo OTG  |  Santo André, SP  |  Brasil', 9, 'normal', '#888888')

  // ── Contato ──
  section('CONTATO')
  txt('Email:     victor.tarriga@gmail.com', 9, 'normal', '#333333')
  gap(1)
  txt('LinkedIn:  linkedin.com/in/victortarriga', 9, 'normal', '#333333')
  gap(1)
  txt('GitHub:    github.com/victortarriga', 9, 'normal', '#333333')
  gap(1)
  txt('WhatsApp:  +55 11 94562-3412', 9, 'normal', '#333333')

  // ── Resumo ──
  section('RESUMO PROFISSIONAL')
  txt(
    'Profissional com mais de 20 anos de experiência, incluindo 12 anos em contabilidade antes de migrar para tecnologia e produtos digitais. Formado em Análise e Desenvolvimento de Sistemas e Ciências Contábeis. Atuei como Squad Leader, Scrum Master e Product Owner Sênior em Grupo OTG e Dexco, sempre na interseção entre negócio, tecnologia e pessoas.',
    9, 'normal', '#333333',
  )

  // ── Experiência ──
  section('EXPERIÊNCIA PROFISSIONAL')
  for (const exp of experiences) {
    checkPage(16)
    txt(exp.role, 10, 'bold', '#111111')
    gap(1)
    txt(`${exp.company}  |  ${exp.period}`, 8, 'normal', '#666666')
    gap(1)
    if (exp.compact) {
      txt(exp.bullets[0], 8, 'normal', '#444444')
    } else {
      for (const b of exp.bullets) {
        txt(`•  ${b}`, 8, 'normal', '#444444')
        gap(0.5)
      }
    }
    gap(3)
  }

  // ── Formação ──
  section('FORMAÇÃO ACADÊMICA')
  for (const edu of education) {
    checkPage(12)
    txt(edu.degree, 10, 'bold', '#111111')
    gap(1)
    txt(`${edu.school}  |  ${edu.period}`, 8, 'normal', '#666666')
    gap(3)
  }

  // ── Certificações ──
  section('CERTIFICAÇÕES (29)')
  for (const c of certifications) {
    checkPage(6)
    txt(`•  ${c.name}  —  ${c.issuer}  (${c.year})`, 8, 'normal', '#333333')
    gap(0.5)
  }

  // ── Skills ──
  section('HARD SKILLS')
  for (const g of skillGroups) {
    checkPage(10)
    txt(g.label, 9, 'bold', '#333333')
    gap(1)
    txt(g.skills.join('  ·  '), 8, 'normal', '#555555')
    gap(3)
  }

  doc.save('CV-Victor-Tarriga.pdf')
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id) },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}

function useScrollReveal() {
  useEffect(() => {
    let obs: IntersectionObserver | null = null
    const raf = requestAnimationFrame(() => {
      obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs?.unobserve(e.target) }
        }),
        { threshold: 0, rootMargin: '0px 0px -40px 0px' },
      )
      document.querySelectorAll('.reveal').forEach(el => obs!.observe(el))
    })
    return () => { cancelAnimationFrame(raf); obs?.disconnect() }
  }, [])
}

function useTypewriter(text: string, startDelay = 700, speed = 38) {
  const [output, setOutput] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    const start = setTimeout(() => {
      const tick = setInterval(() => {
        if (i < text.length) { setOutput(text.slice(0, ++i)) }
        else { setDone(true); clearInterval(tick) }
      }, speed)
      return () => clearInterval(tick)
    }, startDelay)
    return () => clearTimeout(start)
  }, [text, startDelay, speed])
  return { output, done }
}

function useClipboard(duration = 2000) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), duration)
    } catch { /* noop */ }
  }, [duration])
  return { copied, copy }
}

function useDarkMode() {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])
  const toggle = useCallback(() => setIsDark(v => !v), [])
  return { isDark, toggle }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const active    = useActiveSection(SECTION_IDS)
  const { copied, copy } = useClipboard()
  const { isDark, toggle: toggleDark } = useDarkMode()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [sobreExpanded, setSobreExpanded] = useState(false)
  const [skillPage,  setSkillPage]    = useState(0)
  const [skillVisible,setSkillVisible]= useState(true)
  const [certPage,   setCertPage]     = useState(0)
  const [certVisible,setCertVisible]  = useState(true)
  const [recPage,    setRecPage]      = useState(0)
  const [recVisible, setRecVisible]   = useState(true)

  const goToSkillPage = (newPage: number) => {
    setSkillVisible(false)
    setTimeout(() => { setSkillPage(newPage); setSkillVisible(true) }, 150)
  }
  const goToCertPage = (newPage: number) => {
    setCertVisible(false)
    setTimeout(() => { setCertPage(newPage); setCertVisible(true) }, 150)
  }
  const goToRecPage = (newPage: number) => {
    setRecVisible(false)
    setTimeout(() => { setRecPage(newPage); setRecVisible(true) }, 150)
  }
  const { output: tagline, done: taglineDone } = useTypewriter(
    'Transformo times em máquinas de entrega de produto.',
  )
  useScrollReveal()

  const card = 'rounded-3xl border'
  const cardStyle = { background: 'var(--surface)', borderColor: 'var(--border)' }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div
      className="min-h-screen font-sans antialiased transition-colors duration-300"
      style={{ background: 'var(--bg)' }}
    >
      {/* ── Floating nav ──────────────────────────────────────────────── */}
      <header className="fixed top-5 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-6xl mx-auto px-5 flex justify-center items-center gap-2">
        {/* Pill: logo + links + hamburger */}
        <nav
          className="pointer-events-auto flex items-center gap-0.5 backdrop-blur-xl rounded-full px-2 py-1.5 shadow-2xl shadow-black/40"
          style={{ background: 'color-mix(in srgb, var(--surface) 92%, transparent)', borderColor: 'var(--border)', borderWidth: 1, borderStyle: 'solid' }}
        >
          <button
            onClick={scrollTop}
            className="text-white light:text-neutral-900 font-black text-sm px-3 py-1 rounded-full hover:bg-white/[0.06] light:hover:bg-black/[0.06] transition-colors"
          >
            Victor Tarriga
          </button>
          <div className="h-4 w-px bg-white/10 light:bg-black/10 mx-1 hidden md:block" />

          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`hidden md:inline-flex text-[13px] font-medium px-3 py-1.5 rounded-full transition-all duration-150 ${
                active === l.href.slice(1)
                  ? 'text-orange-400 bg-orange-500/10'
                  : 'text-neutral-400 hover:text-white light:hover:text-neutral-900 hover:bg-white/[0.06] light:hover:bg-black/[0.06]'
              }`}
            >
              {l.label}
            </a>
          ))}

          {/* Mobile hamburger — inside pill */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 hover:text-white light:hover:text-neutral-900 hover:bg-white/[0.06] transition-all"
            aria-label="Menu"
          >
            <Menu size={16} />
          </button>
        </nav>

        {/* Theme toggle — outside pill, desktop only */}
        <button
          onClick={toggleDark}
          className="pointer-events-auto hidden md:flex w-8 h-8 items-center justify-center rounded-full text-neutral-400 hover:text-white light:hover:text-neutral-900 hover:bg-white/10 light:hover:bg-black/10 transition-all"
          aria-label="Alternar tema"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Contato CTA — outside pill, desktop only */}
        <a
          href="#contato"
          className="pointer-events-auto hidden md:inline-flex text-[13px] font-bold bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-full transition-colors duration-150 shadow-lg shadow-orange-500/25"
        >
          Contato
        </a>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative ml-auto w-72 h-full flex flex-col p-6 shadow-2xl"
            style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="self-end w-9 h-9 flex items-center justify-center rounded-full text-neutral-500 hover:text-white light:hover:text-neutral-900 hover:bg-white/10 light:hover:bg-black/10 transition-all mb-6"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col gap-1">
              {navLinks.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-base font-semibold px-4 py-3 rounded-xl transition-all ${
                    active === l.href.slice(1)
                      ? 'text-orange-400 bg-orange-500/10'
                      : 'text-neutral-400 hover:text-white light:hover:text-neutral-900 hover:bg-white/[0.06] light:hover:bg-black/[0.06]'
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Theme toggle inside drawer */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl mt-4"
              style={{ border: '1px solid var(--border)' }}
            >
              <span className="text-sm font-semibold text-neutral-500">
                {isDark ? 'Modo escuro' : 'Modo claro'}
              </span>
              <button
                onClick={toggleDark}
                className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white light:hover:text-neutral-900 hover:bg-white/10 light:hover:bg-black/10 transition-all"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            <a
              href="#contato"
              onClick={() => setMobileOpen(false)}
              className="mt-4 text-center text-sm font-bold bg-orange-500 hover:bg-orange-400 text-white px-4 py-3 rounded-xl transition-colors"
            >
              Contato
            </a>
          </div>
        </div>
      )}

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 pt-28 pb-6">
          <div
            className={`${card} reveal`}
            style={{
              ...cardStyle,
              backgroundImage: `radial-gradient(ellipse 80% 50% at 70% 0%, rgba(234,88,12,0.18) 0%, transparent 60%), radial-gradient(circle at 1px 1px, var(--dot) 1px, transparent 0)`,
              backgroundSize: 'auto, 28px 28px',
            }}
          >
            {/* ── 2-col grid: conteúdo | KPIs ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] lg:items-start">

              {/* Coluna esquerda — conteúdo principal */}
              <div className="p-8 md:p-10">
                {/* Avatar + status */}
                <div className="flex items-center gap-4 mb-6">
                  {PROFILE_PHOTO ? (
                    <img
                      src={PROFILE_PHOTO}
                      alt="Victor Tarriga"
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 shadow-lg ring-2 ring-orange-500/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                      <span className="text-2xl font-black text-white tracking-tight">VT</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                      <span className="text-sm text-neutral-500 font-medium">
                        Disponível para oportunidades
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 light:text-neutral-500">
                      Santo André · São Paulo · Brasil
                    </p>
                  </div>
                </div>

                {/* Nome — linha única, pb-3 garante espaço para descenders */}
                <div className="pb-3 mb-2">
                  <h1
                    className={`text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br ${
                      isDark
                        ? 'from-white via-neutral-100 to-neutral-500'
                        : 'from-neutral-900 via-neutral-700 to-neutral-500'
                    }`}
                  >
                    Victor Hugo Tarriga Gomes
                  </h1>
                </div>

                {/* Role tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Squad Leader', 'QA', 'Scrum Master', 'Product Owner', 'CSPO®', 'Tecnologia', 'IA'].map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-semibold text-orange-400 border border-orange-500/30 bg-orange-500/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tagline */}
                <p className="text-base text-neutral-300 light:text-neutral-600 font-medium max-w-lg leading-relaxed border-l-[2px] border-orange-500 pl-4 mb-7 min-h-[1.75rem]">
                  {tagline}
                  {!taglineDone && (
                    <span className="inline-block w-0.5 h-5 bg-orange-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:victor.tarriga@gmail.com"
                    className="inline-flex items-center gap-2 text-sm font-bold bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-xl transition-colors duration-150"
                  >
                    <EmailIcon /> Fale comigo
                  </a>
                  <button
                    onClick={downloadCV}
                    className="inline-flex items-center gap-2 text-sm font-semibold border text-neutral-400 hover:text-white light:hover:text-neutral-900 px-5 py-2.5 rounded-xl transition-all duration-150"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Download size={14} /> Baixar CV
                  </button>
                  <a
                    href="https://linkedin.com/in/victortarriga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold border text-neutral-400 hover:text-white light:hover:text-neutral-900 px-5 py-2.5 rounded-xl transition-all duration-150"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <LinkedInIcon /> LinkedIn
                  </a>
                  <a
                    href="https://github.com/victortarriga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold border text-neutral-400 hover:text-white light:hover:text-neutral-900 px-5 py-2.5 rounded-xl transition-all duration-150"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <GitHubIcon /> GitHub
                  </a>
                </div>

                {/* Cargos-alvo */}
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  <span className="text-[11px] font-black text-neutral-700 light:text-neutral-500 uppercase tracking-[0.18em] mr-1 shrink-0">
                    Aberto a:
                  </span>
                  {targetRoles.map(r => (
                    <span
                      key={r}
                      className="text-xs font-medium px-3 py-1 rounded-lg text-neutral-500 light:text-neutral-600"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>

                {/* KPI strip — mobile only */}
                <div
                  className="grid grid-cols-2 gap-4 mt-8 pt-8 lg:hidden"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  {kpis.map(({ value, label, Icon }) => (
                    <div key={value} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-white light:text-neutral-900 leading-none">{value}</p>
                        <p className="text-xs text-neutral-600 light:text-neutral-500 font-medium mt-0.5 leading-tight">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna direita — KPIs empilhados (desktop only) */}
              <div
                className="hidden lg:flex flex-col m-4 ml-0 rounded-2xl overflow-hidden"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                {kpis.map(({ value, label, Icon }, i) => (
                  <div
                    key={value}
                    className="flex-1 flex flex-col items-center justify-center text-center px-4 py-5"
                    style={i < kpis.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}}
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-2">
                      <Icon size={14} className="text-orange-400" />
                    </div>
                    <p className="text-3xl font-black text-white light:text-neutral-900 leading-none">{value}</p>
                    <p className="text-[11px] text-neutral-600 light:text-neutral-500 font-medium mt-1.5 leading-tight max-w-[110px]">{label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── Sobre ─────────────────────────────────────────────────────── */}
        <section id="sobre" className="max-w-6xl mx-auto px-5 py-6 scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2"><SectionLabel>Sobre</SectionLabel></div>
            <div><SectionLabel>Perfil</SectionLabel></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className={`md:col-span-2 ${card} p-8 reveal`} style={cardStyle}>
              <div>
                <div className={`text-[15px] text-neutral-400 light:text-neutral-600 leading-relaxed space-y-3 ${sobreExpanded ? '' : 'line-clamp-4'}`}>
                  <p>Profissional com mais de <span className="text-white light:text-neutral-900 font-semibold">20 anos de experiência</span>, sendo 12 deles em contabilidade, antes de migrar para tecnologia e produtos digitais. Formado em Análise e Desenvolvimento de Sistemas e Ciências Contábeis, fascinado por tecnologia e por unir pessoas a desafios de alta escala ou em momento de grande transformação.</p>
                  <p>Atualmente, atuando no <span className="text-white light:text-neutral-900 font-semibold">Grupo OTG</span> como Squad Leader e Scrum Master, onde sou responsável pelo time ágil, priorizando e entregando os backlogs de diferentes projetos. Também atuo como Product Owner Sênior — minha especialidade — na <span className="text-white light:text-neutral-900 font-semibold">Dexco</span>, onde trabalho com as marcas Deca, Portinari, Ceusa, Duratex, Durafloor, Casttelato e Hudra.</p>
                  <p>Antes disso, Product Owner Sênior na <span className="text-white light:text-neutral-900 font-semibold">Restoque S/A</span> (Richards, Le Lis Blanc, Bo.Bô, John John, Baumgart), até a chegada da pandemia em 2020.</p>
                  <p>Atuação como Startup Specialist na <span className="text-white light:text-neutral-900 font-semibold">e-volve.in</span>, conectando startups a talentos e investimentos no Brasil, EUA e Europa. Paralelamente, Angel Investor na <span className="text-white light:text-neutral-900 font-semibold">e-volve.ac</span> aceleradora.</p>
                  <p>Hobbysta: programador amador, gamer inveterado, produtor musical e entusiasta de astronomia.</p>
                  <p>Habilidades e competências: Agilidade, Gestão de Produto e Projetos, Liderança de Times, VTEX, Azure DevOps, GitHub, SQL, Python, React, TypeScript, Vite, Supabase e mais.</p>
                  <p className="text-orange-400/90 font-medium italic">"Minha missão é impactar e transformar a maior quantidade de pessoas possível!"</p>
                </div>
                <button
                  onClick={() => setSobreExpanded(e => !e)}
                  className="mt-3 text-xs text-orange-500/70 hover:text-orange-400 font-semibold transition-colors"
                >
                  {sobreExpanded ? 'ler menos' : 'ler mais'}
                </button>
                <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-[11px] font-black text-orange-500/40 uppercase tracking-[0.2em] mb-3">Aberto a</p>
                  <div className="flex flex-wrap gap-2">
                    {['Squad Leader', 'Scrum Master', 'Technical Product Owner', 'Delivery Manager', 'Product Analyst Sênior'].map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1 rounded-lg text-neutral-400 light:text-neutral-600"
                        style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <div className={`${card} p-7 reveal reveal-d1`} style={cardStyle}>
              <div className="space-y-0">
                {[
                  { k: 'Headline', v: 'Squad Leader | QA | Scrum Master | Product Owner - CSPO® | Projetos | Tecnologia | IA' },
                  { k: 'Localização', v: 'Santo André, SP' },
                  { k: 'Status', v: 'Aberto a oportunidades' },
                  { k: 'Email', v: 'victor.tarriga@gmail.com' },
                  { k: 'LinkedIn', v: '/in/victortarriga' },
                  { k: 'GitHub', v: '/victortarriga' },
                ].map(({ k, v }) => (
                  <div key={k} className="py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <p className="text-[11px] text-neutral-700 light:text-neutral-500 font-black uppercase tracking-wide">{k}</p>
                    <p className="text-xs text-neutral-300 light:text-neutral-700 font-medium mt-0.5 truncate">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Experiência ───────────────────────────────────────────────── */}
        <section id="experiencia" className="max-w-6xl mx-auto px-5 py-6 scroll-mt-20">
          <div className="mb-4"><SectionLabel>Experiência</SectionLabel></div>
          <div className={`${card} p-8 md:p-10`} style={cardStyle}>
            <div className="space-y-0">
              {experiences.map((exp, i) => (
                <div
                  key={i}
                  className={`relative grid grid-cols-1 md:grid-cols-[190px_1fr] gap-4 md:gap-10 pb-10 last:pb-0 reveal reveal-d${Math.min(i + 1, 4)} ${
                    exp.compact ? 'opacity-35 hover:opacity-55 transition-opacity' : ''
                  }`}
                >
                  {/* Timeline line */}
                  {i < experiences.length - 1 && (
                    <div
                      className="hidden md:block absolute left-[190px] top-3 bottom-0 w-px"
                      style={{ background: 'linear-gradient(to bottom, rgba(234,88,12,0.25), transparent)' }}
                    />
                  )}
                  {/* Timeline dot */}
                  <div
                    className={`hidden md:flex absolute left-[187px] top-[9px] w-2 h-2 rounded-full ${
                      exp.current ? 'ring-4 ring-orange-500/15' : ''
                    }`}
                    style={{ background: exp.current ? '#f97316' : 'var(--border)' }}
                  />

                  {/* Meta */}
                  <div className="flex flex-row md:flex-col gap-2 items-start md:items-end md:text-right md:pt-1 md:pr-3">
                    <span className="text-xs font-mono text-neutral-600 light:text-neutral-500 leading-relaxed">{exp.period}</span>
                    {exp.current && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400/90 border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        atual
                      </span>
                    )}
                    {exp.badge && (
                      <span className="text-[11px] text-orange-400/80 border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 rounded-full font-semibold">
                        {exp.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`pl-5 ${exp.compact ? 'border-l border-neutral-800' : 'border-l-2 border-orange-500/40 hover:border-orange-500/70 transition-colors duration-200'}`}
                  >
                    <h3
                      className={`font-black leading-tight ${
                        exp.compact
                          ? 'text-sm text-neutral-600'
                          : 'text-white light:text-neutral-900 text-xl md:text-2xl'
                      }`}
                    >
                      {exp.role}
                    </h3>
                    <p className="text-orange-400 text-sm font-semibold mt-1 mb-4">{exp.company}</p>
                    {exp.compact ? (
                      <p className="text-neutral-600 text-sm italic">{exp.bullets[0]}</p>
                    ) : (
                      <ul className="space-y-2">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="flex gap-2.5 text-[14px] text-neutral-400 light:text-neutral-600 leading-relaxed">
                            <span className="text-orange-500/50 shrink-0 mt-[7px] text-[6px]">●</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Formação ──────────────────────────────────────────────────── */}
        <section id="formacao" className="max-w-6xl mx-auto px-5 py-6 scroll-mt-20">
          <div className="mb-4"><SectionLabel>Formação</SectionLabel></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {education.map((edu, i) => (
              <div
                key={i}
                className={`${card} p-7 hover:border-orange-500/25 transition-colors duration-200 reveal reveal-d${i + 1}`}
                style={cardStyle}
              >
                <p className="text-white light:text-neutral-900 font-bold text-base leading-snug">{edu.degree}</p>
                <p className="text-orange-400/70 text-sm font-medium mt-1.5">{edu.school}</p>
                <p className="text-xs font-mono text-neutral-700 mt-4">{edu.period}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ── Skills ────────────────────────────────────────────────────── */}
        <section id="skills" className="max-w-6xl mx-auto px-5 py-6 scroll-mt-20">
          <div className="mb-4"><SectionLabel>Habilidades</SectionLabel></div>
          <div className="relative" style={{ overflow: 'visible' }}>
            <div className={`${card} w-full p-6`} style={cardStyle}>
              <div style={{ opacity: skillVisible ? 1 : 0, transition: 'opacity 0.15s' }}>
                <p className="text-[11px] font-black text-neutral-700 light:text-neutral-500 uppercase tracking-[0.2em] mb-5">
                  {skillGroups[skillPage].label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillGroups[skillPage].skills.map(skill => (
                    <span
                      key={skill}
                      className="text-sm font-medium px-4 py-2 rounded-xl text-neutral-300 light:text-neutral-600 hover:text-orange-300 hover:border-orange-500/40 hover:bg-orange-500/[0.06] transition-all duration-150 cursor-default"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {skillGroups.map((_, p) => (
                  <button
                    key={p}
                    onClick={() => goToSkillPage(p)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${p === skillPage ? 'bg-orange-500' : 'bg-neutral-700 hover:bg-neutral-500'}`}
                    aria-label={`Página ${p + 1}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => goToSkillPage((skillPage + skillGroups.length - 1) % skillGroups.length)}
              className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-150 bg-neutral-800/80 hover:bg-orange-500"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goToSkillPage((skillPage + 1) % skillGroups.length)}
              className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-150 bg-neutral-800/80 hover:bg-orange-500"
              aria-label="Próxima"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* ── Certificações ─────────────────────────────────────────────── */}
        <section id="certificacoes" className="max-w-6xl mx-auto px-5 py-6 scroll-mt-20">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <SectionLabel>Certificações</SectionLabel>
            <span className="text-xs font-mono text-neutral-700">29 total</span>
          </div>
          <div className="relative" style={{ overflow: 'visible' }}>
            <div className={`${card} w-full p-6`} style={cardStyle}>
              <div style={{ opacity: certVisible ? 1 : 0, transition: 'opacity 0.15s' }}>
                <div className="grid grid-cols-3 gap-3">
                  {certifications.slice(certPage * 6, certPage * 6 + 6).map((cert, i) => (
                    <div
                      key={i}
                      className="p-px rounded-2xl hover:scale-[1.01] transition-transform duration-200"
                      style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.3), rgba(255,255,255,0.04))' }}
                    >
                      <div className="h-full rounded-[15px] p-5" style={{ background: 'var(--surface)' }}>
                        <div className="flex items-start gap-3">
                          <span className="text-orange-500/60 text-sm mt-0.5 shrink-0">★</span>
                          <div className="min-w-0">
                            <p className="text-white light:text-neutral-900 font-semibold text-sm leading-snug">{cert.name}</p>
                            <div className="flex items-center justify-between mt-3 gap-2">
                              <span className="text-xs text-orange-400/60 truncate font-medium">{cert.issuer}</span>
                              <span className="text-xs font-mono text-neutral-700">{cert.year}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: CERT_PAGES }, (_, p) => (
                  <button
                    key={p}
                    onClick={() => goToCertPage(p)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${p === certPage ? 'bg-orange-500' : 'bg-neutral-700 hover:bg-neutral-500'}`}
                    aria-label={`Página ${p + 1}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => goToCertPage((certPage + CERT_PAGES - 1) % CERT_PAGES)}
              className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-150 bg-neutral-800/80 hover:bg-orange-500"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goToCertPage((certPage + 1) % CERT_PAGES)}
              className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-150 bg-neutral-800/80 hover:bg-orange-500"
              aria-label="Próxima"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* ── Recomendações ─────────────────────────────────────────────── */}
        <section id="recomendacoes" className="max-w-6xl mx-auto px-5 py-6 scroll-mt-20">
          <div className="mb-4 reveal">
            <SectionLabel>Recomendações</SectionLabel>
            <span className="text-xs font-mono text-neutral-700 block mt-1">7 no LinkedIn</span>
          </div>
          <div className="relative" style={{ overflow: 'visible' }}>
            <div
              className="grid md:grid-cols-2 gap-6 w-full"
              style={{ opacity: recVisible ? 1 : 0, transition: 'opacity 0.15s' }}
            >
              {recommendations.slice(recPage === 3 ? 6 : recPage * 2, recPage === 3 ? 7 : recPage * 2 + 2).map(rec => (
                <RecCard key={rec.name} rec={rec} />
              ))}
            </div>
            <button
              onClick={() => goToRecPage((recPage + 3) % 4)}
              className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-150 bg-neutral-800/80 hover:bg-orange-500"
              aria-label="Anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => goToRecPage((recPage + 1) % 4)}
              className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-150 bg-neutral-800/80 hover:bg-orange-500"
              aria-label="Próxima"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {[0, 1, 2, 3].map(p => (
              <button
                key={p}
                onClick={() => goToRecPage(p)}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${p === recPage ? 'bg-orange-500' : 'bg-neutral-700 hover:bg-neutral-500'}`}
                aria-label={`Página ${p + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ── Contato ───────────────────────────────────────────────────── */}
        <section id="contato" className="max-w-6xl mx-auto px-5 py-6 pb-10 scroll-mt-20">
          <div className="mb-4"><SectionLabel>Contato</SectionLabel></div>
          <div
            className={`${card} p-10 md:p-14 overflow-hidden relative reveal`}
            style={{
              ...cardStyle,
              backgroundImage: `radial-gradient(ellipse 60% 80% at 80% 50%, rgba(234,88,12,0.12) 0%, transparent 70%), radial-gradient(circle at 1px 1px, var(--dot) 1px, transparent 0)`,
              backgroundSize: 'auto, 28px 28px',
            }}
          >
            <p className="text-neutral-400 light:text-neutral-600 text-base leading-relaxed max-w-md">
              Aberto a conversas sobre liderança de produto, agilidade ou oportunidades de colaboração.
            </p>

            {/* Clipboard email */}
            <button
              onClick={() => copy('victor.tarriga@gmail.com')}
              className="group inline-flex items-center gap-3 mt-8 text-white light:text-neutral-900 hover:text-orange-300 text-xl md:text-2xl font-black tracking-tight transition-colors duration-150"
            >
              victor.tarriga@gmail.com
              <span
                className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full transition-all duration-200 ${
                  copied
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'bg-white/[0.06] light:bg-black/[0.06] text-neutral-600 border border-transparent group-hover:border-orange-500/30 group-hover:text-orange-400'
                }`}
              >
                {copied ? <><Check size={12} /> Copiado!</> : <><Copy size={12} /> Copiar</>}
              </span>
            </button>

            <div className="flex flex-wrap gap-6 mt-6">
              <a href="https://wa.me/5511945623412" target="_blank" rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-[#25D366] transition-colors flex items-center gap-2 font-medium">
                <WhatsAppIcon size={14} /> +55 11 94562-3412
              </a>
              <a href="https://linkedin.com/in/victortarriga" target="_blank" rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-white light:hover:text-neutral-900 transition-colors flex items-center gap-2 font-medium">
                <LinkedInIcon size={14} /> linkedin.com/in/victortarriga
              </a>
              <a href="https://github.com/victortarriga" target="_blank" rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-white light:hover:text-neutral-900 transition-colors flex items-center gap-2 font-medium">
                <GitHubIcon size={14} /> github.com/victortarriga
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-5 py-6">
        <div
          className="flex items-center justify-between gap-4 flex-wrap pt-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs text-neutral-800 font-mono">
            © {new Date().getFullYear()} Victor Hugo Tarriga Gomes
          </p>
          <span className="text-xs text-neutral-800 font-mono">Santo André · SP · Brasil</span>
        </div>
      </footer>
    </div>
  )
}

// ─── Components ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-black text-orange-500/60 uppercase tracking-[0.25em]">
      {children}
    </p>
  )
}

function RecCard({ rec }: { rec: typeof recommendations[0] }) {
  const [imgError, setImgError] = useState(false)
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className="flex flex-col rounded-2xl p-6 border hover:border-orange-500/20 transition-colors duration-200"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-orange-500/60 text-5xl font-serif leading-none select-none">"</span>
        <a
          href={rec.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-700 hover:text-[#0A66C2] transition-colors mt-2"
          aria-label={`LinkedIn de ${rec.name}`}
        >
          <LinkedInIcon size={16} />
        </a>
      </div>
      <div className="flex-1">
        <p className={`text-neutral-300 light:text-neutral-600 text-[13.5px] leading-[1.8] italic ${expanded ? '' : 'line-clamp-6'}`}>
          {rec.text}
          <span className="not-italic text-orange-500/60 font-serif ml-0.5" style={{ fontSize: '2em', lineHeight: 1, verticalAlign: '-0.15em' }}>"</span>
        </p>
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-1.5 text-xs text-orange-500/70 hover:text-orange-400 font-semibold transition-colors"
        >
          {expanded ? 'ler menos' : 'ler mais'}
        </button>
      </div>
      <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
        {imgError ? (
          <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xs font-black text-orange-400 shrink-0">
            {rec.initials}
          </div>
        ) : (
          <img
            src={rec.photo}
            alt={rec.name}
            onError={() => setImgError(true)}
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10"
          />
        )}
        <div className="min-w-0">
          <p className="text-white light:text-neutral-900 text-sm font-bold leading-snug truncate">{rec.name}</p>
          <p className="text-neutral-600 text-xs font-medium mt-0.5 truncate">{rec.role}</p>
          <p className="text-neutral-700 text-[11px] mt-0.5 truncate">{rec.relation}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function EmailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
