// Shared description of the organization network used by the 3D scene and its SVG fallback.
export type NodeKind = 'data' | 'people'
export type NetNode = { id: string; label: string; kind: NodeKind; pos: [number, number, number] }

// Hand-placed on a loose shell so the layout is composed, not random.
export const NET_NODES: NetNode[] = [
  { id: 'sql', label: 'SQL', kind: 'data', pos: [-2.5, 1.3, 0.2] },
  { id: 'oracle', label: 'Oracle', kind: 'data', pos: [-2.2, -1.35, 1.1] },
  { id: 'mongo', label: 'MongoDB', kind: 'data', pos: [-0.2, -2.35, -0.6] },
  { id: 'docs', label: 'Documents', kind: 'data', pos: [2.4, -1.5, 0.5] },
  { id: 'api', label: 'APIs', kind: 'data', pos: [2.9, 0.7, -0.8] },
  { id: 'crm', label: 'CRM', kind: 'data', pos: [1.2, 2.3, 0.7] },
  { id: 'reports', label: 'Reports', kind: 'data', pos: [-1.3, 2.45, -0.9] },
  { id: 'people', label: 'People', kind: 'people', pos: [-1.9, 0.1, 2.3] },
]

// Which sources light up for each hero question.
export const SOURCES_FOR: Record<string, string[]> = {
  sales: ['sql', 'oracle', 'crm', 'reports'],
  people: ['docs', 'people'],
  default: ['sql', 'mongo', 'docs', 'api'],
}
