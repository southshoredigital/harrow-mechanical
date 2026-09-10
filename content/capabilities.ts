import type { Capability } from './types'

/**
 * Five capabilities, one per System. The order here is the order
 * they appear in the spec rail on /capabilities.
 *
 * The first is a worked example. Fill the rest to the same depth.
 */
export const capabilities: Capability[] = [
  {
    slug: 'mechanical',
    title: 'Mechanical',
    summary:
      'Central plant, air handling and distribution for buildings from 2,000 to 40,000 square metres.',
    detail: [
      'Design and construct, or construct to a consultant specification. Most work comes through head contractors on competitive tender, and a smaller share direct from asset owners who have worked with us before.',
      'Plant selection is done against whole of life cost rather than capital cost alone, because most of the buildings we work in will still be running this equipment in twenty years.',
    ],
    scope: [
      'Water and air cooled chiller plant to 2MW',
      'Air handling units, fan coil units, VAV and CAV systems',
      'Ductwork fabrication and installation to DW/144',
      'Kitchen and carpark ventilation to AS 1668.2',
      'Theatre and cleanroom ventilation with HEPA filtration',
      'Plant room construction and staged changeover in live buildings',
    ],
    relatedProjects: ['northfield-private-hospital-plant-upgrade'],
  },

  {
    slug: 'hydraulic',
    title: 'Hydraulic',
    summary:
      'Pressure pipework, reticulation and drainage carrying chilled water, hydronic heating, glycol and trade waste.',
    detail: [
      'Hydraulic scope on our jobs is rarely a standalone package. It is the reticulation that makes the mechanical plant do anything: the pipework, pumping and storage between a chiller and a fan coil, or a boiler and a calorifier.',
      'Work is welded, roll grooved or pressed depending on size and service, pressure tested before insulation goes on, and recorded against an isolation schedule on anything touching a live system.',
    ],
    scope: [
      'Chilled and condenser water reticulation, DN50 to DN300, welded and pressure tested to AS 4041',
      'Hydronic heating and low temperature hot water distribution, pre-insulated and vapour sealed',
      'Glycol reticulation for process and refrigeration duties',
      'Trade waste, sanitary drainage and roof drainage to AS/NZS 3500',
      'Pump selection, staging and variable speed control for primary, secondary and tertiary circuits',
      'Thermal and buffer storage sizing for ride-through and load levelling',
      'Calorifiers, heated water plant and thermostatic mixing to AS 4032.3',
    ],
    relatedProjects: [
      'warragul-aged-care-hydronic-replacement',
      'truganina-data-centre-mechanical-package',
      'dandenong-south-process-chilling-plant',
      'laverton-north-distribution-centre',
    ],
  },

  {
    slug: 'controls',
    title: 'Controls',
    summary:
      'DDC and BMS design, programming and integration, from a single floor extension to a full head end replacement.',
    detail: [
      'Controls is where a mechanical system either performs to the design intent or drifts away from it over the first year of operation. We write and commission the sequences ourselves rather than subcontracting the logic.',
      'Where a site already has a BMS we extend it on the existing platform and standard. Where it needs replacing, points and trend history are migrated rather than started from zero.',
    ],
    scope: [
      'DDC controller design and programming, BACnet/IP and Modbus integration',
      'BMS head end replacement and points database migration',
      'Zone control, VAV and VRF sequencing to occupancy and timetable schedules',
      'Room pressure cascade and containment interlocks to AS/NZS 2243.3',
      'Fault, alarm and trend logging routed to site engineering or facility management',
      'Energy metering per floor, per tenancy or per system for NABERS and tenant billing',
      'Graphics and operator interface built to the existing site standard where one exists',
    ],
    relatedProjects: [
      'clayton-research-building-mechanical-services',
      'truganina-data-centre-mechanical-package',
      'cranbourne-east-teaching-wing',
      'collins-street-heritage-office-hvac-replacement',
    ],
  },

  {
    slug: 'commissioning',
    title: 'Commissioning',
    summary:
      'Independent, witnessed proof that installed plant performs to the design figures, not just to the drawing.',
    detail: [
      'Commissioning is treated as a discipline with its own program, not the last two weeks before handover. On multi-system jobs it is sequenced against the construction program from the outset.',
      'Results are recorded against the design criteria and issued as a witnessed report, not a checklist. Where a client runs their own commissioning agent, our figures are provided for independent verification rather than as a substitute.',
    ],
    scope: [
      'Air and water balancing to AIRAH DA27 and DA28',
      'Integrated systems testing under simulated and full design load',
      'Witnessed performance testing with the client engineering team or an independent commissioning agent',
      'Containment and pressure cascade verification to AS/NZS 2243.3 and AusHFG Part D',
      'Building tuning through the first year of occupancy against design intent',
      'O&M documentation, as-installed drawings and training handover',
      'Commissioning management to AIRAH DA19 on multi-disciplinary projects',
    ],
    relatedProjects: [
      'northfield-private-hospital-plant-upgrade',
      'clayton-research-building-mechanical-services',
      'truganina-data-centre-mechanical-package',
      'bayswater-coatings-plant-ventilation',
    ],
  },

  {
    slug: 'maintenance',
    title: 'Maintenance',
    summary:
      'Scheduled and reactive maintenance contracts, $40k to $180k a year, sized to the plant rather than a standard package.',
    detail: [
      'Most maintenance contracts start as the handover of a project we installed, where the isolation schedule, points list and O&M set are already ours. New contracts on plant we did not install begin with a condition audit before a schedule is agreed.',
      'On call coverage is rostered, not ad hoc, and every reactive call is closed out against the asset register so the next scheduled visit picks up where the last one left off.',
    ],
    scope: [
      'Scheduled preventive maintenance to manufacturer and AS 1851 service intervals',
      '24 hour reactive breakdown response, rostered on-call coverage',
      'Statutory testing and certification, including essential safety measures',
      'Legionella risk management and water sampling to AS/NZS 3666.3',
      'Refrigerant handling and reporting to ozone protection and synthetic greenhouse gas obligations',
      'Asset condition reporting and lifecycle replacement planning',
      'Planned shutdown coordination in occupied and live-critical buildings',
    ],
    relatedProjects: [
      'warragul-aged-care-hydronic-replacement',
      'notting-hill-colocation-cooling-retrofit',
      'moorabbin-office-fitout',
    ],
  },
]
