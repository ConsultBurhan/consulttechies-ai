import kfg from '../assets/clients/kout-food-group/kout-food-group-1024.png'
import burgerKing from '../assets/clients/burger-king/burger-king-512.png'
import pizzaHut from '../assets/clients/pizza-hut/pizza-hut-512.png'
import subway from '../assets/clients/subway/subway-512.png'
import tacoBell from '../assets/clients/taco-bell/taco-bell-512.png'
import applebees from '../assets/clients/applebees/applebees-512.png'
import speedyBunny from '../assets/clients/speedy-bunny/speedy-bunny-512.png'
import kababji from '../assets/clients/kababji/kababji-512.png'
import almaviva from '../assets/clients/almaviva-de-belgique/almaviva-de-belgique-512.png'
import euaa from '../assets/clients/euaa/euaa-512.png'
import tellgo from '../assets/clients/tellgo/tellgo-512.png'
import prezien from '../assets/clients/prezien/prezien-512.png'
import hs from '../assets/clients/hs-store/hs-store-512.png'

export type Client = { id: string; name: string; logo: string; note?: string; place?: string }

export const FLAGSHIP: Client & { blurb: string } = {
  id: 'kfg', name: 'Kout Food Group', logo: kfg, place: 'Kuwait', note: 'Multi-brand restaurant operator',
  blurb: 'A Kuwait-based food service group running more than 250 stores across a portfolio of international and homegrown restaurant brands.',
}

// brands that sit inside the flagship group (master franchise and in-house concepts)
export const GROUP_BRANDS: Client[] = [
  { id: 'bk', name: 'Burger King', logo: burgerKing, place: 'Kuwait', note: 'Kout Food Group brand' },
  { id: 'ph', name: 'Pizza Hut', logo: pizzaHut, place: 'Kuwait', note: 'Kout Food Group brand' },
  { id: 'subway', name: 'Subway', logo: subway, place: 'Kuwait', note: 'Kout Food Group brand' },
  { id: 'tb', name: 'Taco Bell', logo: tacoBell, place: 'Kuwait', note: 'Kout Food Group brand' },
  { id: 'applebees', name: 'Applebee’s', logo: applebees, place: 'Kuwait', note: 'Kout Food Group brand' },
  { id: 'speedy', name: 'Speedy Bunny', logo: speedyBunny, place: 'Kuwait', note: 'Kout Food Group brand' },
]

export const OTHERS: Client[] = [
  { id: 'almaviva', name: 'AlmavivA de Belgique', logo: almaviva, place: 'Belgium', note: 'IT services · AlmavivA Group' },
  { id: 'euaa', name: 'European Union Agency for Asylum', logo: euaa, place: 'European Union', note: 'Public agency' },
  { id: 'kababji', name: 'Kababji', logo: kababji, place: 'Lebanon', note: 'Restaurants' },
  { id: 'hs', name: 'H&S Store', logo: hs, note: 'Retail' },
  { id: 'tellgo', name: 'tellgo', logo: tellgo },
  { id: 'prezien', name: 'Prezien', logo: prezien },
]

export const ALL: Client[] = [...GROUP_BRANDS, ...OTHERS]

/** The twelve clients below the flagship, grouped into four layers of the ecosystem (grouping is editorial, change freely). */
export const ECOSYSTEM = [
  { key: 'brands', n: '01', title: 'Global food brands', line: 'Household names, run at scale.', accent: '#e0481f', ids: ['bk', 'ph', 'tb'] },
  { key: 'dining', n: '02', title: 'Dining & delivery', line: 'Everyday meals, at the table and at the door.', accent: '#e9a420', ids: ['subway', 'applebees', 'speedy'] },
  { key: 'tech', n: '03', title: 'Technology & institutions', line: 'Where precision and public trust matter most.', accent: '#2f9bd6', ids: ['almaviva', 'euaa', 'tellgo'] },
  { key: 'growing', n: '04', title: 'Regional & growing brands', line: 'Local favourites with room to grow.', accent: '#22b8b4', ids: ['kababji', 'hs', 'prezien'] },
] as const
