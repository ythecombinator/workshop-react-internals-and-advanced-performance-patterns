import { createWorld, trait } from 'koota';

//  ---------------------------------------------------------------------------
//  KOOTA WORLD SETUP
//  ---------------------------------------------------------------------------

//  Koota stores trait data in two layouts depending on how the trait is defined:
//
//    Schema-based   ->  trait({ x: 0, y: 0 })       ->  SoA (Struct of Arrays)
//    Callback-based ->  trait(() => ({ x: 0, y: 0 }))  ->  AoS (Array of Structs)
//
//  We create separate worlds for each layout so benchmarks don't interfere.

export function setupKootaWorlds(entityCount: number, fieldCount: number) {
  // SoA trait: schema object -> each field stored in its own contiguous array
  const soaSchema: Record<string, number> = {};

  for (let field = 0; field < fieldCount; field++) {
    soaSchema[`f${field}`] = 0;
  }

  const SoATrait = trait(soaSchema);

  // AoS trait: callback -> each entity stored as a distinct heap object
  const AoSTrait = trait(() => {
    const entity: Record<string, number> = {};

    for (let field = 0; field < fieldCount; field++) {
      entity[`f${field}`] = Math.random() * 1000;
    }

    return entity;
  });

  const aosWorld = createWorld();
  const soaWorld = createWorld();

  // Spawn AoS entities (the callback generates random values per entity)
  for (let index = 0; index < entityCount; index++) {
    aosWorld.spawn(AoSTrait);
  }

  // Spawn SoA entities with matching random initial values
  for (let index = 0; index < entityCount; index++) {
    const initData: Record<string, number> = {};

    for (let field = 0; field < fieldCount; field++) {
      initData[`f${field}`] = Math.random() * 1000;
    }

    soaWorld.spawn(SoATrait(initData));
  }

  return { aosWorld, soaWorld, AoSTrait, SoATrait };
}

export function destroyWorlds(...worlds: ReturnType<typeof createWorld>[]) {
  for (const world of worlds) {
    world.destroy();
  }
}
