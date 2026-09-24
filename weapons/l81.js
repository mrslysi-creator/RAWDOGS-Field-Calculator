/* RAWDOGS Field Calculator — L81 weapon profile
   Verified from WARDOGS firing-range sight screenshots on 2026-09-24.
   The captured table is intentionally not extrapolated beyond the photographed sight data.
*/
window.RAWDOGS_WEAPONS = window.RAWDOGS_WEAPONS || {};
window.RAWDOGS_WEAPONS.L81 = {
  id: 'L81',
  enabled: true,
  label: 'L81 MORTAR',
  menuLabel: 'L81 MORTAR',
  dataVersion: '1.1',
  testedDate: '2026-09-24',
  coordinateScaleMeters: 100,
  solverId: 'range-table-linear',
  outputLabel: 'MIL',
  positionLabel: 'Mortar position — stays saved',
  presetLabels: ['MORTAR A', 'MORTAR B'],
  defaultPositions: {
    A: { name: 'Main FOB Mortar', x: '98.38', y: '110.43' },
    B: { name: 'Mortar B', x: '', y: '' }
  },
  calibration: {
    allowExtrapolation: false,
    verifiedMinRange: 80,
    verifiedMaxRange: 684,
    marks: [
      { range: 80,  mil: 950 },
      { range: 110, mil: 900 },
      { range: 132, mil: 850 },
      { range: 187, mil: 800 },
      { range: 240, mil: 750 },
      { range: 290, mil: 700 },
      { range: 340, mil: 650 },
      { range: 385, mil: 600 },
      { range: 430, mil: 550 },
      { range: 470, mil: 500 },
      { range: 510, mil: 450 },
      { range: 545, mil: 400 },
      { range: 578, mil: 350 },
      { range: 609, mil: 300 },
      { range: 637, mil: 250 },
      { range: 661, mil: 200 },
      { range: 684, mil: 150 }
    ]
  }
};
