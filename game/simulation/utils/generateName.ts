const nameM = [ "Achernar", "Acrux", "Aerglo", "Alioth", "Alnair", "Alpherg", "Altair", "Antaris", "Apodis", "Apollo", "Apus", "Aquila", "Arae", "Arche", "Archer", "Arcturus", "Aries", "Arneb", "Aten", "Atlas", "Aura", "Auriga", "Caelum", "Callisto", "Canes", "Cassio", "Castor", "Cepheus", "Ceres", "Cetus", "Charon", "Circinus", "Columba", "Comet", "Copernicus", "Corvus", "Cosmo", "Cosmos", "Crucis", "Crux", "Cygnus", "Dalim", "Deimos", "Draco", "Dusk", "Eos", "Equinox", "Eridanus", "Fenrir", "Fermi", "Fornacis", "Fornax", "Galileo", "Ganymede", "Grus", "Halcyon", "Halley", "Halo", "Hamal", "Hercules", "Holmes", "Hubble", "Hunter", "Hydri", "Hydrus", "Hyperion", "Indus", "Janus", "Jericho", "Jovian", "Jupiter", "Kale", "Leo", "Leonardi", "Leonid", "Leonis", "Leporis", "Lepus", "Lupus", "Lyncis", "Lynx", "Mars", "Mercury", "Naos", "Nash", "Neptune", "Neso", "Nimbus", "Nix", "Nova", "Oberon", "Octans", "Orion", "Pallas", "Pavo", "Pavonis", "Perseus", "Phact", "Phoenix", "Pluto", "Polaris", "Pollux", "Prometheus", "Proteus", "Pulsar", "Pyxis", "Quasar", "Rigel", "Sagan", "Saros", "Saturn", "Seren", "Serpens", "Sirius", "Sol", "Solar", "Tarf", "Taurus", "Themis", "Titan", "Triton", "Volans", "Volantis", "Vulcan", "Ymir", "Zeke", "Zenith" ];
const nameF = [ "Aerglo", "Alcyone", "Algedi", "Alhena", "Alioth", "Alnair", "Alphecca", "Alula", "Alya", "Amalthea", "Andromeda", "Ankaa", "Antlia", "Antliae", "Aquila", "Ara", "Arae", "Ariel", "Aries", "Arpina", "Aster", "Astris", "Atria", "Aura", "Auriga", "Aurora", "Auva", "Belinda", "Bellatrix", "Bianca", "Caeli", "Callisto", "Calypso", "Capella", "Carina", "Carinae", "Cassini", "Cassio", "Cassiopeia", "Celeste", "Cephei", "Ceres", "Ceti", "Chandra", "Chara", "Charon", "Circini", "Cordelia", "Corvi", "Cressida", "Crucis", "Cygni", "Cyllene", "Dawn", "Delphini", "Dione", "Diphda", "Elara", "Elera", "Equulei", "Eridani", "Eris", "Estella", "Esther", "Europa", "Fay", "Fermi", "Gaia", "Galatea", "Galexia", "Gemini", "Gemma", "Gienah", "Halley", "Halo", "Helene", "Helia", "Hydri", "Indi", "Io", "Isonoe", "Janus", "Juliet", "Kalindi", "Kore", "Lacerta", "Larissa", "Leda", "Leporis", "Libra", "Luna", "Lupi", "Lyncis", "Lyra", "Lyrae", "Maia", "Mercury", "Meridian", "Miranda", "Moira", "Neso", "Nix", "Norma", "Normae", "Nova", "Ophelia", "Orionis", "Pandora", "Pavo", "Pegasi", "Persei", "Phoebe", "Phoenix", "Pisces", "Portia", "Pyxis", "Rhea", "Rossi", "Sagitta", "Saros", "Scorpii", "Scuti", "Seren", "Tauri", "Thebe", "Titania", "Urania", "Vega", "Vela", "Venus", "Virgo", "Volans", "Zeke" ];
const greekAlphabet = "ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσςΤτΥυΦφΧχΨψΩω";

const randomNameM = (): string => nameM[Math.floor(Math.random() * nameM.length)];
const randomNameF = (): string => nameF[Math.floor(Math.random() * nameF.length)];
const randomGreekLetter = (): string => greekAlphabet[Math.floor(Math.random() * greekAlphabet.length)];
const randomSliceFromName = (name: string): string => {
  const sliceLen = Math.ceil(name.length * Math.random());
  const start = Math.floor((name.length - sliceLen) * Math.random());
  const slice = name.slice(start, start + sliceLen);
  return slice.charAt(0).toUpperCase() + slice.slice(1).toLowerCase();
}
const randomNameMashed = (numSlices: number = 2): string => {
  const slices: string[] = [];
  for (let i = 0; i < numSlices; i++) {
    const name = Math.random() < 0.5 ? randomNameF() : randomNameM();
    slices.push(randomSliceFromName(name));
  }
  let name = '';
  for (let i = 0; i < slices.length; i++) {
    name += slices[i];
    if (i < slices.length - 1) {
      name +=
        Math.random() < 0.01 ? '-' :
        Math.random() < 0.01 ? '\'' :
         '';
    }
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export default function generateName(): string {
  const nparts = Math.floor(Math.random() * 2.01) + 1;
  const parts = [];
  for (let i = 0; i < nparts; i++) {
    const r = Math.random();
    if (r < 0.01)
      parts.push(randomNameF());
    else if (r < 0.02)
      parts.push(randomNameM());
    else if (r < 0.03)
      parts.push(randomSliceFromName(randomNameF()));
    else if (r < 0.04)
      parts.push(randomSliceFromName(randomNameM()));
    else
      parts.push(randomNameMashed(Math.ceil(1 + Math.random() * 1.01)));
  }
  if (Math.random() < 0.1) {
    const l = randomGreekLetter();
    Math.random() < 0.5 ? parts.push(l) : parts.unshift(l);
  }
  return parts.join(" ");
}

let a = ''
for (let i = 0; i < 100; i++) {
  a += generateName() + '\n'
}
console.log(a);