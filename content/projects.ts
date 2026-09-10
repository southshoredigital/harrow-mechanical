import type { Project } from './types'

/**
 * Twelve projects, spread across all five sectors.
 * Six marked `featured: true` for the homepage selection.
 *
 * The first entry is a worked example showing the level of detail expected.
 * `constraints` is the field estimators actually read - make it specific.
 */
export const projects: Project[] = [
  {
    slug: 'northfield-private-hospital-plant-upgrade',
    title: 'Northfield Private Hospital plant upgrade',
    client: 'Head contractor, health sector',
    location: 'Berwick, Victoria',
    sector: 'Health',
    systems: ['Mechanical', 'Controls', 'Commissioning'],
    contractValue: 3_180_000,
    durationMonths: 14,
    completionYear: 2025,
    brief:
      'Staged replacement of central plant serving four theatres and a 60 bed ward block, carried out with the hospital fully operational throughout.',
    systemsInstalled: [
      '2 × 850kW water cooled chillers with N+1 redundancy',
      'Theatre AHUs with HEPA filtration to AS 1668.2',
      'Hydronic distribution, 620m primary and secondary pipework',
      'BMS head end replacement, 1,400 points',
      'Emergency power changeover and load testing',
    ],
    constraints:
      'No theatre could be offline for more than 72 hours, and no works were permitted within 20m of the ward block between 7pm and 7am. Plant was craned in over three night shifts with the adjoining road closed under permit.',
    outcome:
      'Delivered across fourteen months with no unplanned theatre downtime. Commissioning witnessed by the hospital engineering team and independent commissioning agent. Handed over with full O&M documentation and twelve months defects liability.',
    images: [
      {
        src: '/images/projects/northfield-plant-room.jpg',
        alt: 'Chiller plant room with primary hydronic pipework and pumps',
        width: 2400,
        height: 1600,
      },
    ],
    featured: true,
  },

  {
    slug: 'frankston-day-procedure-unit',
    title: 'Frankston day procedure unit',
    client: 'Head contractor, health sector',
    location: 'Frankston, Victoria',
    sector: 'Health',
    systems: ['Mechanical', 'Controls', 'Commissioning'],
    contractValue: 740_000,
    durationMonths: 7,
    completionYear: 2022,
    brief:
      'Mechanical services to two procedure rooms, a clean utility and an eight bay recovery area, formed inside an existing level one consulting suite.',
    systemsInstalled: [
      '2 × procedure room AHUs, 2.4 m³/s each, 20 air changes per hour to AusHFG Part D',
      'Room pressure cascade, +15 Pa procedure to +5 Pa clean utility, monitored at each door',
      '14 × chilled water fan coil units off the existing 400kW house plant',
      'Manifold room and plant room exhaust to AS 2896',
      'DDC controller extension to the existing BMS, 260 points, no head end change',
    ],
    constraints:
      'Two of the three risers shown as clear on the as built set were grouted solid, which was only found once the level one ceiling came down. The new chilled water drops were moved to the eastern core and required four new structural penetrations, each certified by the building engineer. The consulting suite on the level below stayed in use throughout, so the house chilled water could not be isolated outside two agreed weekend shutdowns.',
    outcome:
      'Seven months. Air change rates and room pressure differentials measured against AusHFG Part D by an independent commissioning agent and witnessed by the health service engineering manager before occupancy. Both procedure rooms recorded at 20 air changes per hour at design flow.',
    images: [
      {
        src: '/images/projects/frankston-day-procedure-unit-1.jpg',
        alt: 'Procedure room ceiling with laminar supply diffuser and return grilles',
        width: 2400,
        height: 1600,
      },
    ],
  },

  {
    slug: 'warragul-aged-care-hydronic-replacement',
    title: 'Warragul aged care hydronic replacement',
    client: 'Building owner, direct engagement',
    location: 'Warragul, Victoria',
    sector: 'Health',
    systems: ['Mechanical', 'Hydraulic', 'Maintenance'],
    contractValue: 1_420_000,
    durationMonths: 11,
    completionYear: 2021,
    brief:
      'Replacement of end of life boiler plant, hydronic heating and heated water services to a 96 bed residential aged care facility across three wings.',
    systemsInstalled: [
      '3 × 400kW condensing gas boilers in N+1, cascade controlled on return water temperature',
      '2 × 1,200 litre calorifiers with thermostatic mixing to 45°C at resident outlets, AS 4032.3',
      '1,850m of pre-insulated hydronic reticulation to 96 rooms and four common areas',
      'Primary and secondary variable speed pumps, 2 × 11kW duty/standby on each circuit',
      'Water safety plan and Legionella control regime to AS/NZS 3666.3, with monthly sampling points',
    ],
    constraints:
      'Residents were not relocated for any part of the works. Heating was maintained to every occupied room by running the existing boilers on a temporary header while the new plant was built alongside, then cutting over one wing at a time across three weekends. The changeover window was fixed by the heating season and closed on 1 May, after which the old boilers could no longer be relied on to carry a wing.',
    outcome:
      'Cut over across three weekends in October and November 2021 with no room off heating for more than six hours. Site gas consumption metered at 31% below the previous year over the following winter on comparable degree days. Facility rolled onto a scheduled maintenance contract in December 2021.',
    images: [
      {
        src: '/images/projects/warragul-aged-care-hydronic-replacement-1.jpg',
        alt: 'Boiler room with three cascade controlled condensing boilers and headers',
        width: 2400,
        height: 1600,
      },
      {
        src: '/images/projects/warragul-aged-care-hydronic-replacement-2.jpg',
        alt: 'Insulated hydronic flow and return pipework with valve labelling',
        width: 2400,
        height: 1600,
      },
    ],
  },

  {
    slug: 'clayton-research-building-mechanical-services',
    title: 'Clayton research building mechanical services',
    client: 'Head contractor, education sector',
    location: 'Clayton, Victoria',
    sector: 'Education',
    systems: ['Mechanical', 'Controls', 'Commissioning'],
    contractValue: 2_350_000,
    durationMonths: 16,
    completionYear: 2024,
    brief:
      'Full mechanical package to a four level teaching and research building containing eighteen fume cupboards and two PC2 containment laboratories.',
    systemsInstalled: [
      '18 × variable air volume fume cupboards, face velocity held at 0.5 m/s to AS/NZS 2243.8',
      '2 × 6.5 m³/s laboratory exhaust fans, duty/standby, 12 m/s discharge velocity',
      '4 × air handling units totalling 22 m³/s with run around coil heat recovery',
      'PC2 containment zone pressure control to AS/NZS 2243.3, interlocked to the fume cupboard sashes',
      'BMS integration over BACnet/IP, 3,100 points, with fume cupboard fault alarms routed to the faculty safety officer',
    ],
    constraints:
      'The planning approval capped the exhaust stacks at 2m above the parapet, and the nearest outside air intake belonged to an occupied building 18m to the north. Discharge dispersion was modelled twice and the stack arrangement changed from four discharges to two combined high velocity discharges to meet the separation required by AS/NZS 2243.8 within the approved height. Tie in of the new exhaust to the existing wing was confined to the mid year non teaching period, a nineteen day window.',
    outcome:
      'Sixteen months. All eighteen fume cupboards containment tested to AS/NZS 2243.8 with the building at design airflow, results issued to the university safety officer before occupancy. Building handed over on 12 January 2024 ahead of semester one.',
    images: [
      {
        src: '/images/projects/clayton-research-building-mechanical-services-1.jpg',
        alt: 'Laboratory fume cupboards with sash position indicators and airflow monitors',
        width: 2400,
        height: 1600,
      },
      {
        src: '/images/projects/clayton-research-building-mechanical-services-2.jpg',
        alt: 'Roof mounted laboratory exhaust fans with high velocity discharge stacks',
        width: 2400,
        height: 1600,
      },
    ],
  },

  {
    slug: 'cranbourne-east-teaching-wing',
    title: 'Cranbourne East teaching wing',
    client: 'Head contractor, education sector',
    location: 'Cranbourne East, Victoria',
    sector: 'Education',
    systems: ['Mechanical', 'Controls'],
    contractValue: 680_000,
    durationMonths: 6,
    completionYear: 2023,
    brief:
      'Mechanical services to a twelve classroom teaching wing and a single court gymnasium, built alongside an operating secondary college.',
    systemsInstalled: [
      '14 × 14kW reverse cycle VRF indoor units on 2 × 45kW condensing units',
      'Outside air at 15 L/s per person via 2 × heat recovery ventilators, AS 1668.2',
      '2 × 3.5 m³/s roof mounted packaged units to the gymnasium, 45 dB(A) at the nearest boundary',
      'Zone controllers with term timetable and holiday scheduling, setpoints locked to the VSBA range',
      'CO2 monitoring in all twelve learning spaces, displayed at the teacher wall panel',
    ],
    constraints:
      'Roof plant had to land on the first Saturday of the summer holidays because the only crane position was in the staff car park, which needed a 55 tonne crane and a closure of the adjoining service road under permit. That date could not move, so the roof structure, penetrations and plinths were all brought forward ahead of the wing being weathertight. For the fourteen term days that overlapped the program, site access was restricted to a gated window between 9am and 2.30pm with no crane or elevated work while students were on the ground.',
    outcome:
      'Handed over 20 January 2023, five days before term one. Airflows, CO2 sensor calibration and gymnasium boundary noise witnessed by the project manager. Twelve month defects liability completed January 2024.',
    images: [
      {
        src: '/images/projects/cranbourne-east-teaching-wing-1.jpg',
        alt: 'Roof mounted packaged units on plinths above a school gymnasium',
        width: 2400,
        height: 1600,
      },
    ],
    featured: true,
  },

  {
    slug: 'truganina-data-centre-mechanical-package',
    title: 'Truganina data centre mechanical package',
    client: 'Head contractor, data centre sector',
    location: 'Truganina, Victoria',
    sector: 'Data centre',
    systems: ['Mechanical', 'Hydraulic', 'Controls', 'Commissioning'],
    contractValue: 4_150_000,
    durationMonths: 18,
    completionYear: 2026,
    brief:
      'Mechanical package for a new build facility of 4.5MW IT load across two data halls, delivered to a concurrently maintainable design.',
    systemsInstalled: [
      '4 × 1,100kW air cooled chillers, N+1, on a common primary variable flow header',
      '24 × chilled water in row cooling units, 2.4MW sensible per hall',
      '2 × 60,000 litre thermal storage tanks giving five minutes of ride through at design load',
      '940m of dual path chilled water reticulation, DN250 to DN80, welded and tested to AS 4041',
      'Dual redundant BMS controllers with concurrently maintainable sequences on every isolation point',
    ],
    constraints:
      'Nothing in the chilled water system could be isolated in a way that dropped a hall, so every valve, pump and controller was proved twice: once on paper against the isolation schedule before pressure test, then again live under load. The integrated systems test was booked with the incoming tenant twelve months out as a fixed two week window, which put every preceding milestone on a date rather than a float, including a single 400 tonne crane day for the four chillers and both storage tanks.',
    outcome:
      'Integrated systems testing ran eleven days in February 2026 at 100% of design IT load on 4.5MW of load banks. All 42 failure scenarios were executed with no cold aisle exceeding 27°C. Commissioning records issued to AIRAH DA19 with the isolation schedule as a handover document.',
    images: [
      {
        src: '/images/projects/truganina-data-centre-mechanical-package-1.jpg',
        alt: 'External chiller yard with four air cooled chillers and dual path headers',
        width: 2400,
        height: 1600,
      },
      {
        src: '/images/projects/truganina-data-centre-mechanical-package-2.jpg',
        alt: 'Data hall cold aisle with in row cooling units between cabinet rows',
        width: 2400,
        height: 1600,
      },
    ],
    featured: true,
  },

  {
    slug: 'notting-hill-colocation-cooling-retrofit',
    title: 'Notting Hill colocation cooling retrofit',
    client: 'Building owner, direct engagement',
    location: 'Notting Hill, Victoria',
    sector: 'Data centre',
    systems: ['Mechanical', 'Controls', 'Maintenance'],
    contractValue: 1_860_000,
    durationMonths: 10,
    completionYear: 2022,
    brief:
      'Replacement of end of life direct expansion room units with chilled water cooling in a live 1.1MW colocation facility carrying customer service level agreements.',
    systemsInstalled: [
      '10 × 180kW chilled water room units replacing DX units on a one for one swap',
      '2 × 650kW air cooled chillers with free cooling coils, economiser active below 14°C ambient',
      'Cold aisle containment to eight rows, 96 cabinets, with blanking of 340 open floor penetrations',
      'Overhead chilled water reticulation, 410m of roll grooved DN150 and DN100 on new supports',
      'Under floor and pipework leak detection tape alarmed to the BMS and the operations centre',
    ],
    constraints:
      'No customer outage was available at any point, so each unit was swapped hot inside a single nine hour night window with temporary spot cooling and a rack level temperature watch running against agreed abort criteria. The floor void was 450mm and already carrying power and data, so the chilled water could not go under the floor and was run overhead through an occupied hall, which meant every support penetration into the slab soffit had to be scanned and approved above live cabinets.',
    outcome:
      'Ten units replaced over 32 night shifts between March and November 2022 with no customer affecting incident recorded. Facility PUE metered at 1.42 across the following twelve months against 1.71 for the twelve months before the works. Rolled onto a scheduled maintenance contract in December 2022.',
    images: [
      {
        src: '/images/projects/notting-hill-colocation-cooling-retrofit-1.jpg',
        alt: 'Overhead chilled water pipework above contained cabinet rows in a data hall',
        width: 2400,
        height: 1600,
      },
    ],
    featured: true,
  },

  {
    slug: 'dandenong-south-process-chilling-plant',
    title: 'Dandenong South process chilling plant',
    client: 'Head contractor, industrial sector',
    location: 'Dandenong South, Victoria',
    sector: 'Industrial',
    systems: ['Mechanical', 'Hydraulic', 'Commissioning'],
    contractValue: 2_080_000,
    durationMonths: 12,
    completionYear: 2023,
    brief:
      'Glycol process chilling and a 1,100 m² cold store for a chilled food manufacturer, installed around a production line running six days a week.',
    systemsInstalled: [
      '2 × 700kW glycol chillers, 35% propylene glycol at −4°C flow',
      '2 × 15,000 litre buffer tanks with sequenced changeover on tank differential',
      '820m of vapour sealed pre-insulated glycol reticulation to fourteen process users',
      '4 × 46kW cold store evaporators holding 1,100 m² at 2°C ±1°C',
      'Washdown rated ductwork and stainless penetration seals through the production hall envelope',
    ],
    constraints:
      'The only tie in windows were the Sunday sanitation shifts, fourteen hours each, and nine tie ins were staged across nine consecutive Sundays. Any work above an open line required the line to be stripped and re-sanitised before restart, so each Sunday started with a pre-start alongside the plant quality manager and a written scope that could not grow on the day. Hot work above the production floor was not permitted at any time, so all overhead glycol pipework was roll grooved and pressure tested off line before it went up.',
    outcome:
      'Twelve months with no production shift lost to the works. Glycol flow held at −4°C ±0.5°C across all fourteen users at full process load during witnessed testing. Cold store pull down from ambient to 2°C recorded at 26 hours.',
    images: [
      {
        src: '/images/projects/dandenong-south-process-chilling-plant-1.jpg',
        alt: 'Glycol chiller skid with buffer tanks and insulated flow and return headers',
        width: 2400,
        height: 1600,
      },
      {
        src: '/images/projects/dandenong-south-process-chilling-plant-2.jpg',
        alt: 'Cold store ceiling evaporators above stainless clad walls',
        width: 2400,
        height: 1600,
      },
    ],
  },

  {
    slug: 'bayswater-coatings-plant-ventilation',
    title: 'Bayswater coatings plant ventilation',
    client: 'Building owner, direct engagement',
    location: 'Bayswater, Victoria',
    sector: 'Industrial',
    systems: ['Mechanical', 'Commissioning'],
    contractValue: 540_000,
    durationMonths: 5,
    completionYear: 2021,
    brief:
      'Local exhaust ventilation, filtration and tempered make up air to a solvent based coatings line, replacing a system that no longer met the site licence conditions.',
    systemsInstalled: [
      '6 × capture hoods over the coating and drying stations at 0.8 m/s face velocity, AS/NZS 4114.1',
      'Spark resistant exhaust fan, 4.2 m³/s, with an Ex rated motor selected to AS/NZS 60079.14 for the classified zone',
      'Carbon filtration bank sized for 92% VOC removal at 4.2 m³/s, with differential pressure alarms',
      '2 × direct gas fired make up air units, 3.6 m³/s combined, tempering to 18°C',
      'Capture velocity monitoring at each hood, alarmed at 80% of design',
    ],
    constraints:
      'Residential properties sit 40m south of the plant and the site licence caps boundary noise at 42 dB(A) between 10pm and 7am. The selected exhaust fan runs at 61 dB(A) at 3m, so it was housed in an acoustic enclosure with a 1.8m discharge attenuator, and because the boundary setback could not be reduced the whole enclosure had to fit within the existing hardstand alongside the LPG store separation distance.',
    outcome:
      'Boundary noise measured at 39 dB(A) at the nearest residential façade with the plant at full duty, verified by an independent acoustic consultant in March 2021. Capture velocities recorded at all six hoods and issued with the licence compliance report.',
    images: [
      {
        src: '/images/projects/bayswater-coatings-plant-ventilation-1.jpg',
        alt: 'Extraction hoods above a coating line with ducted risers to roof plant',
        width: 2400,
        height: 1600,
      },
    ],
    featured: true,
  },

  {
    slug: 'laverton-north-distribution-centre',
    title: 'Laverton North distribution centre',
    client: 'Head contractor, industrial sector',
    location: 'Laverton North, Victoria',
    sector: 'Industrial',
    systems: ['Mechanical', 'Hydraulic', 'Controls'],
    contractValue: 3_400_000,
    durationMonths: 15,
    completionYear: 2025,
    brief:
      'Mechanical and hydraulic services to a 38,000 m² distribution facility with a 4,200 m² chilled pick face and a two level office.',
    systemsInstalled: [
      '3 × 900kW low charge ammonia packaged chillers to AS/NZS 5149',
      '12 × 62kW ceiling mounted evaporators holding the 4,200 m² pick face at 4°C',
      '6 × smoke exhaust fans, 12 m³/s each, rated 300°C for 60 minutes to AS 1668.1',
      '220kW of office VRF across two levels with after hours metering per tenancy',
      '1,400m of DN100 to DN300 trade waste and roof drainage to AS/NZS 3500',
    ],
    constraints:
      'Lease commencement was fixed twelve months before practical completion and the tenant racking installer had a contracted start that could not move, so roof plant, smoke exhaust and the pick face refrigeration all had to be complete and pressure tested before racking took the floor. Eleven weeks were lost to a wet spring early in the program. The balance was recovered by splitting the pick face and office packages across two crews on staggered six day weeks, with the smoke exhaust fans installed from the roof rather than from below to keep the floor clear.',
    outcome:
      'Practical completion 8 August 2025, two days inside the contract date. Pick face pull down from ambient to 4°C recorded at 19 hours with dock doors sealed. Smoke exhaust performance witnessed by the building surveyor and included in the essential safety measures schedule issued with the occupancy permit.',
    images: [
      {
        src: '/images/projects/laverton-north-distribution-centre-1.jpg',
        alt: 'Chilled pick face with ceiling mounted evaporators above racking aisles',
        width: 2400,
        height: 1600,
      },
      {
        src: '/images/projects/laverton-north-distribution-centre-2.jpg',
        alt: 'Warehouse roof with smoke exhaust fans and condensing plant',
        width: 2400,
        height: 1600,
      },
    ],
  },

  {
    slug: 'collins-street-heritage-office-hvac-replacement',
    title: 'Collins Street heritage office HVAC replacement',
    client: 'Building owner, direct engagement',
    location: 'Melbourne, Victoria',
    sector: 'Commercial office',
    systems: ['Mechanical', 'Controls', 'Commissioning'],
    contractValue: 1_240_000,
    durationMonths: 9,
    completionYear: 2024,
    brief:
      'Replacement of floor plant, air distribution and building controls across eight tenanted floors of a 1926 office building on the Victorian Heritage Register.',
    systemsInstalled: [
      '8 × chilled water air handling units, 2.1 m³/s each, delivered in sections to pass a 1,050mm lift car opening',
      '1 × 420kW air cooled chiller within the existing roof plant enclosure, no change to the screen line',
      '96 zones of perimeter VAV reusing the original riser shafts',
      '380m of chilled water riser pipework in the two light wells, on freestanding frames with no fixings to heritage fabric',
      'BMS replacement, 2,200 points, with energy metering per floor',
    ],
    constraints:
      'The building is on the Victorian Heritage Register, so nothing could be fixed to the façade, the light well brickwork or the ground floor plaster, and no new plant could be visible from Collins Street. Every penetration was submitted as a single schedule with the conservation architect under one heritage permit, which meant the full set out was locked six months before the first core was drilled and any change on site would have gone back for a permit amendment. The 1,050mm lift car and a 2,100mm stair head clearance set the maximum size of every piece of plant that could reach a floor.',
    outcome:
      'Nine months, one floor at a time. All 47 penetrations executed under the approved heritage permit with no amendment. Per floor energy metering handed over with the BMS, giving the owner separated data for the next NABERS rating year.',
    images: [
      {
        src: '/images/projects/collins-street-heritage-office-hvac-replacement-1.jpg',
        alt: 'Sectional air handling unit installed in a narrow original plant room',
        width: 2400,
        height: 1600,
      },
      {
        src: '/images/projects/collins-street-heritage-office-hvac-replacement-2.jpg',
        alt: 'Chilled water risers on freestanding frames within a brick light well',
        width: 2400,
        height: 1600,
      },
    ],
    featured: true,
  },

  {
    slug: 'moorabbin-office-fitout',
    title: 'Moorabbin office fitout',
    client: 'Head contractor, commercial sector',
    location: 'Moorabbin, Victoria',
    sector: 'Commercial office',
    systems: ['Mechanical', 'Controls', 'Maintenance'],
    contractValue: 460_000,
    durationMonths: 4,
    completionYear: 2026,
    brief:
      'Mechanical services to a 1,900 m² single level tenancy for 140 occupants, working off base building air handling plant.',
    systemsInstalled: [
      '38 × VAV boxes off the existing 4.8 m³/s base building AHU, rebalanced to the new layout',
      '2 × 28kW split systems to the comms and UPS rooms, duty/standby on weekly auto changeover',
      'Outside air increased to 12 L/s per person for 140 occupants, AS 1668.2',
      '0.9 m³/s kitchen and end of trip exhaust ducted to the existing roof discharge',
      'Tenancy controllers on the base building BMS network, 410 points, with after hours air conditioning logged per hour',
    ],
    constraints:
      'The ceiling void was 320mm slab soffit to ceiling and 210mm of that was already taken by the base building sprinkler main and the existing lighting track. Every duct run deeper than 250mm was changed to flat oval, and the two runs that still would not resolve were taken around the core after a joint set out on site with the electrical and fire contractors. The tenant ceiling grid was already manufactured, so no bulkhead could be added anywhere on the floor.',
    outcome:
      'Four months. Balanced to design airflow with a maximum deviation of 6% across 38 outlets, recorded in the commissioning report issued at handover in March 2026. Tenancy moved onto a quarterly maintenance contract from April 2026.',
    images: [
      {
        src: '/images/projects/moorabbin-office-fitout-1.jpg',
        alt: 'Flat oval ductwork and VAV boxes in a shallow ceiling void above a fitout',
        width: 2400,
        height: 1600,
      },
    ],
  },
]
