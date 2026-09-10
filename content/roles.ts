import type { Role } from './types'

/**
 * Four roles. Written for a tradesperson reading it on a phone,
 * not for a recruiter. No "fast paced dynamic team", no
 * "we're passionate about excellence".
 *
 * Say what the work actually is, where it is, and what ticket
 * they need. The brief identifies this audience as third by
 * commercial value but the trade shortage makes it matter.
 */
export const roles: Role[] = [
  {
    slug: 'refrigeration-mechanic',
    title: 'Refrigeration Mechanic',
    type: 'Full time',
    location: 'Dandenong South, with sites across metropolitan Melbourne',
    description: [
      'Service and breakdown work across commercial chiller plant, mostly health and data centre sites. Roughly 70 percent planned maintenance, 30 percent reactive.',
      'You would be on a two week rotating on call roster with four other mechanics. On call is paid whether you get called or not.',
      'Vehicle, phone, and tools provided. Start times are 7am from the yard or direct to site, your choice.',
    ],
    requirements: [
      'Trade qualified, Certificate III in Refrigeration and Air Conditioning',
      'Experience on commercial plant rather than residential split systems',
      'Comfortable working in occupied buildings including hospitals',
      'Current driver licence',
    ],
    ticket: 'ARC Refrigerant Handling Licence, full',
  },

  {
    slug: 'controls-technician',
    title: 'Controls Technician',
    type: 'Full time',
    location: 'Dandenong South, with sites across metropolitan Melbourne',
    description: [
      'Programming, commissioning and fault finding on DDC and BMS installations. Mostly new install and upgrade work, some fault callouts on sites we already maintain.',
      'You would be writing sequences from a functional description, not just wiring to a logic diagram someone else wrote. We use a mix of platforms depending on the site, so you will end up across more than one.',
      'Split roughly evenly between plant room work and time at a laptop on the head end. Some early starts for shutdown windows, agreed in advance.',
    ],
    requirements: [
      'Trade background in electrical, instrumentation or controls, or equivalent experience',
      'Working knowledge of BACnet or Modbus integration',
      'Able to read a mechanical services drawing and a control philosophy without translation',
      'Current driver licence',
    ],
  },

  {
    slug: 'project-manager-mechanical',
    title: 'Project Manager, Mechanical',
    type: 'Full time',
    location: 'Dandenong South, with site time across metropolitan Melbourne',
    description: [
      'Running mechanical services packages from award through to defects liability, typically two to four jobs at a time depending on scale. Head contractor relationships, programming, procurement and the site team all sit with you.',
      'You would be the person who tells an estimator whether a tender program actually works before we price it, so time on the tools or in a plant room matters more here than a project management ticket.',
      'Office based in Dandenong South with regular site visits. Vehicle and phone provided.',
    ],
    requirements: [
      'Trade or engineering background in mechanical services, with project delivery experience',
      'Comfortable running a subcontract program against a head contractor master program',
      'Experience with commissioning and handover documentation, not just construction',
      'Current driver licence',
    ],
  },

  {
    slug: 'apprentice-first-year',
    title: 'Apprentice, 1st Year',
    type: 'Apprenticeship',
    location: 'Dandenong South, with sites across metropolitan Melbourne',
    description: [
      'Four year refrigeration and air conditioning apprenticeship, block release through a registered training organisation, on the tools with a qualified mechanic the rest of the time.',
      'Year one is mostly assisting: running pipework, helping with plant changeouts, learning the tools and the ticket requirements before you sit anything yourself.',
      'You would be paired with the same mechanic for extended stretches rather than moved around every week, so there is someone to actually learn from.',
    ],
    requirements: [
      'Year 10 completed, or equivalent',
      'Physically able to work in plant rooms, on ladders and occasionally at height',
      'Willing to attend block release training as required by the apprenticeship',
      'Current driver licence, or working towards one',
    ],
  },
]
