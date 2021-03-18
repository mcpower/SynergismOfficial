import LZString from 'lz-string';

import { getElementById, sortWithIndeces, sumContents } from './Utility';
import { blankGlobals, Globals as G } from './Variables';
import { CalcECC, getChallengeConditions, challengeDisplay, highestChallengeRewards, challengeRequirement, runChallengeSweep, getMaxChallenges } from './Challenges';

import type { Player } from './types/Synergism';
import { upgradeupdate, getConstUpgradeMetadata, buyConstantUpgrades } from './Upgrades';
import { updateResearchBG, maxRoombaResearchIndex, buyResearch } from './Research';
import { updateChallengeDisplay, revealStuff, showCorruptionStatsLoadouts, CSSAscend, CSSRuneBlessings, updateAchievementBG, updateChallengeLevel, buttoncolorchange, htmlInserts, hideStuff, changeTabColor, Confirm, Alert } from './UpdateHTML';
import { calculateHypercubeBlessings } from './Hypercubes';
import { calculateTesseractBlessings } from './Tesseracts';
import { calculateCubeBlessings, calculateObtainium, calculateAnts, calculateRuneLevels, calculateOffline, calculateSigmoidExponential, calculateCorruptionPoints, calculateTotalCoinOwned, calculateTotalAcceleratorBoost, dailyResetCheck, calculateOfferings, calculateAcceleratorMultiplier, calculateTimeAcceleration } from './Calculate';
import { updateTalismanAppearance, toggleTalismanBuy, updateTalismanInventory, buyTalismanEnhance, buyTalismanLevels } from './Talismans';
import { toggleAscStatPerSecond, toggleAntMaxBuy, toggleAntAutoSacrifice, toggleChallenges, keyboardTabChange, toggleauto } from './Toggles';
import { c15RewardUpdate } from './Statistics';
import { resetHistoryRenderAllTables } from './History';
import { calculatePlatonicBlessings } from './PlatonicCubes';
import { autoBuyAnts, sacrificeAnts, calculateCrumbToCoinExp } from './Ants';
import { calculatetax } from './Tax';
import { ascensionAchievementCheck, challengeachievementcheck, achievementaward, resetachievementcheck, buildingAchievementCheck } from './Achievements';
import { reset } from './Reset';
import { buyMax, buyAccelerator, buyMultiplier, boostAccelerator, buyCrystalUpgrades, buyParticleBuilding, getReductionValue, getCost, buyRuneBonusLevels, buyTesseractBuilding, getTesseractCost } from './Buy';
import { autoUpgrades } from './Automation';
import { redeemShards } from './Runes';
import { updateCubeUpgradeBG } from './Cubes';
import { corruptionLoadoutTableUpdate, corruptionButtonsAdd, corruptionLoadoutTableCreate, corruptionStatsUpdate } from './Corruptions';
import { generateEventHandlers } from './EventListeners';
import * as Plugins from './Plugins/Plugins';
import { addTimers, automaticTools } from './Helper';
//import { LegacyShopUpgrades } from './types/LegacySynergism';

import './Logger';
import { checkVariablesOnLoad } from './CheckVariables';

/**
 * Whether or not the current version is a testing version or a main version.
 * This should be detected when importing a file.
 */
export const isTesting = true;

export const intervalHold = new Set<ReturnType<typeof setInterval>>();
export const interval = new Proxy(setInterval, {
    apply(target, thisArg, args) {
        const set = target.apply(thisArg, args);
        intervalHold.add(set);
        return set;
    }
});

export const clearInt = new Proxy(clearInterval, {
    apply(target, thisArg, args) {
        const id = args[0] as ReturnType<typeof setInterval>;
        if (intervalHold.has(id))
            intervalHold.delete(id);

        return target.apply(thisArg, args);
    }
});

export const player: Player = {
    worlds: 0,
    coins: 1,
    coinsThisPrestige: 1,
    coinsThisTranscension: 1,
    coinsThisReincarnation: 1,
    coinsTotal: 1,

    firstOwnedCoin: 0,
    firstGeneratedCoin: 0,
    firstCostCoin: 1,
    firstProduceCoin: 0.02,

    secondOwnedCoin: 0,
    secondGeneratedCoin: 0,
    secondCostCoin: 20,
    secondProduceCoin: 0.2,

    thirdOwnedCoin: 0,
    thirdGeneratedCoin: 0,
    thirdCostCoin: 400,
    thirdProduceCoin: 2,

    fourthOwnedCoin: 0,
    fourthGeneratedCoin: 0,
    fourthCostCoin: 8000,
    fourthProduceCoin: 22,

    fifthOwnedCoin: 0,
    fifthGeneratedCoin: 0,
    fifthCostCoin: 160000,
    fifthProduceCoin: 250,

    firstOwnedDiamonds: 0,
    firstGeneratedDiamonds: 0,
    firstCostDiamonds: 1,
    firstProduceDiamonds: 0.05,

    secondOwnedDiamonds: 0,
    secondGeneratedDiamonds: 0,
    secondCostDiamonds: 50,
    secondProduceDiamonds: 0.0005,

    thirdOwnedDiamonds: 0,
    thirdGeneratedDiamonds: 0,
    thirdCostDiamonds: 2500,
    thirdProduceDiamonds: 0.00005,

    fourthOwnedDiamonds: 0,
    fourthGeneratedDiamonds: 0,
    fourthCostDiamonds: 1e5,
    fourthProduceDiamonds: 0.000005,

    fifthOwnedDiamonds: 0,
    fifthGeneratedDiamonds: 0,
    fifthCostDiamonds: 1e6,
    fifthProduceDiamonds: 0.000005,

    firstOwnedMythos: 0,
    firstGeneratedMythos: 0,
    firstCostMythos: 1,
    firstProduceMythos: 1,

    secondOwnedMythos: 0,
    secondGeneratedMythos: 0,
    secondCostMythos: 50,
    secondProduceMythos: 0.01,

    thirdOwnedMythos: 0,
    thirdGeneratedMythos: 0,
    thirdCostMythos: 2500,
    thirdProduceMythos: 0.001,

    fourthOwnedMythos: 0,
    fourthGeneratedMythos: 0,
    fourthCostMythos: 1e5,
    fourthProduceMythos: 0.0002,

    fifthOwnedMythos: 0,
    fifthGeneratedMythos: 0,
    fifthCostMythos: 1e6,
    fifthProduceMythos: 0.00004,

    firstOwnedParticles: 0,
    firstGeneratedParticles: 0,
    firstCostParticles: 1,
    firstProduceParticles: .25,

    secondOwnedParticles: 0,
    secondGeneratedParticles: 0,
    secondCostParticles: 50,
    secondProduceParticles: .20,

    thirdOwnedParticles: 0,
    thirdGeneratedParticles: 0,
    thirdCostParticles: 2500,
    thirdProduceParticles: .15,

    fourthOwnedParticles: 0,
    fourthGeneratedParticles: 0,
    fourthCostParticles: 1e5,
    fourthProduceParticles: .10,

    fifthOwnedParticles: 0,
    fifthGeneratedParticles: 0,
    fifthCostParticles: 1e6,
    fifthProduceParticles: .5,

    firstOwnedAnts: 0,
    firstGeneratedAnts: 0,
    firstCostAnts: 1e16,
    firstProduceAnts: .0001,

    secondOwnedAnts: 0,
    secondGeneratedAnts: 0,
    secondCostAnts: 20,
    secondProduceAnts: .00005,

    thirdOwnedAnts: 0,
    thirdGeneratedAnts: 0,
    thirdCostAnts: 1e3,
    thirdProduceAnts: .00002,

    fourthOwnedAnts: 0,
    fourthGeneratedAnts: 0,
    fourthCostAnts: 1e6,
    fourthProduceAnts: .00001,

    fifthOwnedAnts: 0,
    fifthGeneratedAnts: 0,
    fifthCostAnts: 1e8,
    fifthProduceAnts: .000005,

    sixthOwnedAnts: 0,
    sixthGeneratedAnts: 0,
    sixthCostAnts: 1e11,
    sixthProduceAnts: .000002,

    seventhOwnedAnts: 0,
    seventhGeneratedAnts: 0,
    seventhCostAnts: 1e15,
    seventhProduceAnts: .000001,

    eighthOwnedAnts: 0,
    eighthGeneratedAnts: 0,
    eighthCostAnts: 1e20,
    eighthProduceAnts: .00000001,

    ascendBuilding1: {
        cost: 1,
        owned: 0,
        generated: 0,
        multiplier: 0.01
    },
    ascendBuilding2: {
        cost: 10,
        owned: 0,
        generated: 0,
        multiplier: 0.01
    },
    ascendBuilding3: {
        cost: 100,
        owned: 0,
        generated: 0,
        multiplier: 0.01
    },
    ascendBuilding4: {
        cost: 1000,
        owned: 0,
        generated: 0,
        multiplier: 0.01
    },
    ascendBuilding5: {
        cost: 10000,
        owned: 0,
        generated: 0,
        multiplier: 0.01
    },

    multiplierCost: 1000,
    multiplierBought: 0,

    acceleratorCost: 100,
    acceleratorBought: 0,

    acceleratorBoostBought: 0,
    acceleratorBoostCost: 100,

    upgrades: Array(141).fill(0),

    prestigeCount: 0,
    transcendCount: 0,
    reincarnationCount: 0,

    prestigePoints: 0,
    transcendPoints: 0,
    reincarnationPoints: 0,

    prestigeShards: 0,
    transcendShards: 0,
    reincarnationShards: 0,

    toggles: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
        19: false,
        20: false,
        21: false,
        22: false,
        23: false,
        24: false,
        25: false,
        26: false,
        27: false,
        28: true,
        29: true,
        30: true,
        31: true,
        32: true,
        33: false,
    },

    challengecompletions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    highestchallengecompletions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    challenge15Exponent: 0,
    highestChallenge15Exponent: 0,

    retrychallenges: false,
    currentChallenge: {
        transcension: 0,
        reincarnation: 0,
        ascension: 0,
    },
    researchPoints: 0,
    obtainiumtimer: 0,
    obtainiumpersecond: 0,
    maxobtainiumpersecond: 0,
    maxobtainium: 0,
    // Ignore the first index. The other 25 are shaped in a 5x5 grid similar to the production appearance
    researches: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    unlocks: {
        coinone: false,
        cointwo: false,
        cointhree: false,
        coinfour: false,
        prestige: false,
        generation: false,
        transcend: false,
        reincarnate: false,
        rrow1: false,
        rrow2: false,
        rrow3: false,
        rrow4: false
    },
    achievements: Array(253).fill(0),

    achievementPoints: 0,

    prestigenomultiplier: true,
    prestigenoaccelerator: true,
    transcendnomultiplier: true,
    transcendnoaccelerator: true,
    reincarnatenomultiplier: true,
    reincarnatenoaccelerator: true,
    prestigenocoinupgrades: true,
    transcendnocoinupgrades: true,
    transcendnocoinorprestigeupgrades: true,
    reincarnatenocoinupgrades: true,
    reincarnatenocoinorprestigeupgrades: true,
    reincarnatenocoinprestigeortranscendupgrades: true,
    reincarnatenocoinprestigetranscendorgeneratorupgrades: true,

    crystalUpgrades: [0, 0, 0, 0, 0, 0, 0, 0],
    crystalUpgradesCost: [7, 15, 20, 40, 100, 200, 500, 1000],

    runelevels: [1, 1, 1, 1, 1],
    runeexp: [0, 0, 0, 0, 0,],
    runeshards: 0,
    maxofferings: 0,
    offeringpersecond: 0,

    prestigecounter: 0,
    transcendcounter: 0,
    reincarnationcounter: 0,
    offlinetick: 0,

    prestigeamount: 0,
    transcendamount: 0,
    reincarnationamount: 0,

    fastestprestige: 9999999999,
    fastesttranscend: 99999999999,
    fastestreincarnate: 999999999999,

    resettoggle1: 1,
    resettoggle2: 1,
    resettoggle3: 1,

    tesseractAutoBuyerToggle: 0,
    tesseractAutoBuyerAmount: 0,

    coinbuyamount: 1,
    crystalbuyamount: 1,
    mythosbuyamount: 1,
    particlebuyamount: 1,
    offeringbuyamount: 1,
    tesseractbuyamount: 1,


    shoptoggles: {
        coin: true,
        prestige: true,
        transcend: true,
        generators: true,
        reincarnate: true,
    },
    tabnumber: 1,
    subtabNumber: 0,

    // create a Map with keys defaulting to false
    codes: new Map(
        Array.from({ length: 30 }, (_, i) => [i + 1, false])
    ),

    shopUpgrades: {
        offeringPotion: 1,
        obtainiumPotion: 1,
        offeringEX: 0,
        offeringAuto: 0,
        obtainiumEX: 0,
        obtainiumAuto: 0,
        instantChallenge: 0,
        antSpeed: 0,
        cashGrab: 0,
        shopTalisman: 0,
        seasonPass: 0,
        challengeExtension: 0,
        challengeTome: 0,
        cubeToQuark: 0,
        tesseractToQuark: 0,
        hypercubeToQuark: 0,
    },
    autoSacrificeToggle: false,
    autoFortifyToggle: false,
    autoEnhanceToggle: false,
    autoResearchToggle: false,
    autoResearch: 0,
    autoSacrifice: 0,
    sacrificeTimer: 0,
    quarkstimer: 90000,

    antPoints: 1,
    antUpgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    antSacrificePoints: 0,
    antSacrificeTimer: 900,
    antSacrificeTimerReal: 900,

    talismanLevels: [0, 0, 0, 0, 0, 0, 0],
    talismanRarity: [1, 1, 1, 1, 1, 1, 1],
    talismanOne: [null, -1, 1, 1, 1, -1],
    talismanTwo: [null, 1, 1, -1, -1, 1],
    talismanThree: [null, 1, -1, 1, 1, -1],
    talismanFour: [null, -1, -1, 1, 1, 1],
    talismanFive: [null, 1, 1, -1, -1, 1],
    talismanSix: [null, 1, 1, 1, -1, -1],
    talismanSeven: [null, -1, 1, -1, 1, 1],
    talismanShards: 0,
    commonFragments: 0,
    uncommonFragments: 0,
    rareFragments: 0,
    epicFragments: 0,
    legendaryFragments: 0,
    mythicalFragments: 0,

    buyTalismanShardPercent: 10,

    autoAntSacrifice: false,
    autoAntSacTimer: 900,
    autoAntSacrificeMode: 0,
    antMax: false,

    ascensionCount: 0,
    ascensionCounter: 0,
    cubeUpgrades: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    platonicUpgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    wowCubes: 0,
    wowTesseracts: 0,
    wowHypercubes: 0,
    wowPlatonicCubes: 0,
    wowAbyssals: 0,
    cubeBlessings: {
        accelerator: 0,
        multiplier: 0,
        offering: 0,
        runeExp: 0,
        obtainium: 0,
        antSpeed: 0,
        antSacrifice: 0,
        antELO: 0,
        talismanBonus: 0,
        globalSpeed: 0
    },
    tesseractBlessings: {
        accelerator: 0,
        multiplier: 0,
        offering: 0,
        runeExp: 0,
        obtainium: 0,
        antSpeed: 0,
        antSacrifice: 0,
        antELO: 0,
        talismanBonus: 0,
        globalSpeed: 0
    },
    hypercubeBlessings: {
        accelerator: 0,
        multiplier: 0,
        offering: 0,
        runeExp: 0,
        obtainium: 0,
        antSpeed: 0,
        antSacrifice: 0,
        antELO: 0,
        talismanBonus: 0,
        globalSpeed: 0
    },
    platonicBlessings: {
        cubes: 0,
        tesseracts: 0,
        hypercubes: 0,
        platonics: 0,
        hypercubeBonus: 0,
        taxes: 0,
        scoreBonus: 0,
        globalSpeed: 0,

    },
    ascendShards: 0,
    autoAscend: false,
    autoAscendMode: "c10Completions",
    autoAscendThreshold: 1,
    roombaResearchIndex: 0,
    ascStatToggles: { // false here means show per second
        1: false,
        2: false,
        3: false,
        4: false
    },

    prototypeCorruptions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    usedCorruptions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    corruptionLoadouts: {
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    corruptionShowStats: true,

    constantUpgrades: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    history: { ants: [], ascend: [], reset: [] },
    historyCountMax: 10,
    historyShowPerSecond: false,

    autoChallengeRunning: false,
    autoChallengeIndex: 1,
    autoChallengeToggles: [false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false],
    autoChallengeStartExponent: 10,
    autoChallengeTimer: {
        start: 10,
        exit: 2,
        enter: 2
    },

    runeBlessingLevels: [0, 0, 0, 0, 0, 0],
    runeSpiritLevels: [0, 0, 0, 0, 0, 0],
    runeBlessingBuyAmount: 0,
    runeSpiritBuyAmount: 0,

    autoTesseracts: [false, false, false, false, false, false],

    saveString: "Synergism-$VERSION$-$TIME$.txt",
    exporttest: false,

    dayCheck: null,
    dayTimer: 0,
    cubeOpenedDaily: 0,
    cubeQuarkDaily: 0,
    tesseractOpenedDaily: 0,
    tesseractQuarkDaily: 0,
    hypercubeOpenedDaily: 0,
    hypercubeQuarkDaily: 0,
    version: '2.5.0~alpha-1',
    rngCode: 0
}

export const blankSave = Object.assign({}, player, {
    codes: new Map(Array.from({ length: 31 }, (_, i) => [i + 1, false]))
});

export const saveSynergy = (button?: boolean): void => {
    player.offlinetick = Date.now();

    // shallow hold, doesn't modify OG object nor is affected by modifications to OG
    const p = Object.assign({}, player, { 
        codes: Array.from(player.codes)
    });

    localStorage.removeItem('Synergysave2');
    localStorage.setItem('Synergysave2', btoa(JSON.stringify(p)));

    if (button) {
        const el = document.getElementById('saveinfo');
        el.textContent = 'Game saved successfully!';
        setTimeout(() => el.textContent = '', 4000);
    }
}

export const loadSynergy = (): void => {
    const save = localStorage.getItem("Synergysave2");
    const data = save ? JSON.parse(atob(save)) : null;

    if (isTesting) {
        Object.defineProperty(window, 'player', {
            value: player
        });
    }

    Object.assign(G, { ...blankGlobals });

    if (data) {
        const hasOwnProperty = {}.hasOwnProperty;

        // size before loading
        const size = player.codes.size;

        const oldPromoKeys = Object.keys(data).filter(k => k.includes('offerpromo'));
        if (oldPromoKeys.length > 0) {
            oldPromoKeys.forEach(k => {
                const value = data[k];
                const num = +k.replace(/[^\d]/g, '');
                player.codes.set(num, Boolean(value));
            });
        }

        Object.keys(data).forEach(function (prop) {
            if (!hasOwnProperty.call(player, prop)) {
                return;
            }

            else if (prop === 'codes') {
                return (player.codes = new Map(data[prop]));
            } else if (Array.isArray(data[prop])) {
                // in old savefiles, some arrays may be 1-based instead of 0-based (newer)
                // so if the lengths of the savefile key is greater than that of the player obj
                // it means a key was removed; likely a 1-based index where array[0] was null
                // so we can get rid of it entirely.
                if (player[prop].length < data[prop].length) {
                    return player[prop] = data[prop].slice(data[prop].length - player[prop].length);
                }
            }

            return (player[prop] = data[prop]);
        });
        if (data.offerpromo24used !== undefined) {
            player.codes.set(25, false)
        }

        // sets all non-existent codes to default value false
        if (player.codes.size < size) {
            for (let i = player.codes.size + 1; i <= size; i++) {
                if (!player.codes.has(i)) {
                    player.codes.set(i, false);
                }
            }
        }

        // sets all non-existent codes to default value false
        if (player.codes.size < size) {
            for (let i = player.codes.size + 1; i <= size; i++) {
                if (!player.codes.has(i)) {
                    player.codes.set(i, false);
                }
            }
        }

        
        checkVariablesOnLoad(data)
        
        if (player.saveString === undefined || player.saveString === "" || player.saveString === "Synergism-v1011Test.txt") {
            player.saveString = "Synergism-$VERSION$-$TIME$.txt"
        }
        getElementById<HTMLInputElement>("saveStringInput").value = player.saveString

        for (let j = 1; j < 126; j++) {
            upgradeupdate(j);
        }

        for (let j = 1; j <= (200); j++) {
            updateResearchBG(j);
        }
        for (let j = 1; j <= 50; j++) {
            updateCubeUpgradeBG(j);
        }

        player.subtabNumber = 0;
        G['runescreen'] = "runes";
        document.getElementById("toggleRuneSubTab1").style.backgroundColor = 'crimson'
        document.getElementById("toggleRuneSubTab1").style.border = '2px solid gold'


        const q = ['coin', 'crystal', 'mythos', 'particle', 'offering', 'tesseract'];
        if (player.coinbuyamount !== 1 && player.coinbuyamount !== 10 && player.coinbuyamount !== 100 && player.coinbuyamount !== 1000) {
            player.coinbuyamount = 1;
        }
        if (player.crystalbuyamount !== 1 && player.crystalbuyamount !== 10 && player.crystalbuyamount !== 100 && player.crystalbuyamount !== 1000) {
            player.crystalbuyamount = 1;
        }
        if (player.mythosbuyamount !== 1 && player.mythosbuyamount !== 10 && player.mythosbuyamount !== 100 && player.mythosbuyamount !== 1000) {
            player.mythosbuyamount = 1;
        }
        if (player.particlebuyamount !== 1 && player.particlebuyamount !== 10 && player.particlebuyamount !== 100 && player.particlebuyamount !== 1000) {
            player.particlebuyamount = 1;
        }
        if (player.offeringbuyamount !== 1 && player.offeringbuyamount !== 10 && player.offeringbuyamount !== 100 && player.offeringbuyamount !== 1000) {
            player.offeringbuyamount = 1;
        }
        if (player.tesseractbuyamount !== 1 && player.tesseractbuyamount !== 10 && player.tesseractbuyamount !== 100 && player.tesseractbuyamount !== 1000) {
            player.tesseractbuyamount = 1;
        }
        for (let j = 0; j <= 5; j++) {
            for (let k = 0; k < 4; k++) {
                let d;
                if (k === 0) {
                    d = 'one';
                }
                if (k === 1) {
                    d = 'ten'
                }
                if (k === 2) {
                    d = 'hundred'
                }
                if (k === 3) {
                    d = 'thousand'
                }
                const e = q[j] + d;
                document.getElementById(e).style.backgroundColor = ""
            }
            let c;
            if (player[q[j] + 'buyamount'] === 1) {
                c = 'one'
            }
            if (player[q[j] + 'buyamount'] === 10) {
                c = 'ten'
            }
            if (player[q[j] + 'buyamount'] === 100) {
                c = 'hundred'
            }
            if (player[q[j] + 'buyamount'] === 1000) {
                c = 'thousand'
            }

            const b = q[j] + c;
            document.getElementById(b).style.backgroundColor = "green"

        }

        const testArray = []
        //Creates a copy of research costs array
        for (let i = 0; i < G['researchBaseCosts'].length; i++) {
            testArray.push(G['researchBaseCosts'][i]);
        }
        //Sorts the above array, and returns the index order of sorted array
        G['researchOrderByCost'] = sortWithIndeces(testArray)
        player.roombaResearchIndex = 0;


        if (player.shoptoggles.coin === false) {
            document.getElementById("shoptogglecoin").textContent = "Auto: OFF"
        }
        if (player.shoptoggles.prestige === false) {
            document.getElementById("shoptoggleprestige").textContent = "Auto: OFF"
        }
        if (player.shoptoggles.transcend === false) {
            document.getElementById("shoptoggletranscend").textContent = "Auto: OFF"
        }
        if (player.shoptoggles.generators === false) {
            document.getElementById("shoptogglegenerator").textContent = "Auto: OFF"
        }
        if (!player.shoptoggles.reincarnate) {
            document.getElementById('particleAutoUpgrade').textContent = "Auto: OFF"
        }

        getChallengeConditions();
        updateChallengeDisplay();
        revealStuff();
        toggleauto();

        document.getElementById("startTimerValue").textContent = format(player.autoChallengeTimer.start, 2, true) + "s"
        getElementById<HTMLInputElement>("startAutoChallengeTimerInput").value = player.autoChallengeTimer.start + '';
        document.getElementById("exitTimerValue").textContent = format(player.autoChallengeTimer.exit, 2, true) + "s"
        getElementById<HTMLInputElement>("exitAutoChallengeTimerInput").value = player.autoChallengeTimer.exit + '';
        document.getElementById("enterTimerValue").textContent = format(player.autoChallengeTimer.enter, 2, true) + "s"
        getElementById<HTMLInputElement>("enterAutoChallengeTimerInput").value = player.autoChallengeTimer.enter + '';

        corruptionStatsUpdate();
        for (let i = 0; i < 4; i++) {
            corruptionLoadoutTableUpdate(i);
        }
        showCorruptionStatsLoadouts()

        for (let j = 1; j <= 5; j++) {
            const ouch = document.getElementById("tesseractAutoToggle" + j);
            (player.autoTesseracts[j]) ?
                (ouch.textContent = "Auto [ON]", ouch.style.border = "2px solid green") :
                (ouch.textContent = "Auto [OFF]", ouch.style.border = "2px solid red");
        }

        document.getElementById("buyRuneBlessingToggleValue").textContent = format(player.runeBlessingBuyAmount, 0, true);
        document.getElementById("buyRuneSpiritToggleValue").textContent = format(player.runeSpiritBuyAmount, 0, true);

        document.getElementById("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * G['effectiveLevelMult'] - 100).toPrecision(4) + "%";

        document.getElementById("talismanlevelup").style.display = "none"
        document.getElementById("talismanrespec").style.display = "none"
        calculatePlatonicBlessings();
        calculateHypercubeBlessings();
        calculateTesseractBlessings();
        calculateCubeBlessings();
        updateTalismanAppearance(1);
        updateTalismanAppearance(2);
        updateTalismanAppearance(3);
        updateTalismanAppearance(4);
        updateTalismanAppearance(5);
        updateTalismanAppearance(6);
        updateTalismanAppearance(7);
        for (const id in player.ascStatToggles) {
            toggleAscStatPerSecond(+id); // toggle each stat twice to make sure the displays are correct and match what they used to be
            toggleAscStatPerSecond(+id);
        }


        if (player.resettoggle1 === 1) {
            document.getElementById("prestigeautotoggle").textContent = "Mode: AMOUNT"
        }
        if (player.resettoggle2 === 1) {
            document.getElementById("transcendautotoggle").textContent = "Mode: AMOUNT"
        }
        if (player.resettoggle3 === 1) {
            document.getElementById("reincarnateautotoggle").textContent = "Mode: AMOUNT"
        }

        if (player.resettoggle1 === 2) {
            document.getElementById("prestigeautotoggle").textContent = "Mode: TIME"
        }
        if (player.resettoggle2 === 2) {
            document.getElementById("transcendautotoggle").textContent = "Mode: TIME"
        }
        if (player.resettoggle3 === 2) {
            document.getElementById("reincarnateautotoggle").textContent = "Mode: TIME"
        }

        if (player.tesseractAutoBuyerToggle === 1) {
            document.getElementById("tesseractautobuytoggle").textContent = "Auto Buy: ON"
            document.getElementById("tesseractautobuytoggle").style.border = "2px solid green"
        }
        if (player.tesseractAutoBuyerToggle === 2) {
            document.getElementById("tesseractautobuytoggle").textContent = "Auto Buy: OFF"
            document.getElementById("tesseractautobuytoggle").style.border = "2px solid red"
        }

        if (player.autoResearchToggle) {
            document.getElementById("toggleautoresearch").textContent = "Automatic: ON"
        }
        if (!player.autoResearchToggle) {
            document.getElementById("toggleautoresearch").textContent = "Automatic: OFF"
        }
        if (player.autoSacrificeToggle == true) {
            document.getElementById("toggleautosacrifice").textContent = "Auto Rune: ON"
            document.getElementById("toggleautosacrifice").style.border = "2px solid green"
        }
        if (player.autoSacrificeToggle == false) {
            document.getElementById("toggleautosacrifice").textContent = "Auto Rune: OFF"
            document.getElementById("toggleautosacrifice").style.border = "2px solid red"
        }
        if (player.autoFortifyToggle == true) {
            document.getElementById("toggleautofortify").textContent = "Auto Fortify: ON"
            document.getElementById("toggleautofortify").style.border = "2px solid green"
        }
        if (player.autoFortifyToggle == false) {
            document.getElementById("toggleautofortify").textContent = "Auto Fortify: OFF"
            document.getElementById("toggleautofortify").style.border = "2px solid red"
        }
        if (player.autoEnhanceToggle == true) {
            document.getElementById("toggleautoenhance").textContent = "Auto Enhance: ON"
            document.getElementById("toggleautoenhance").style.border = "2px solid green"
        }
        if (player.autoEnhanceToggle == false) {
            document.getElementById("toggleautoenhance").textContent = "Auto Enhance: OFF"
            document.getElementById("toggleautoenhance").style.border = "2px solid red"
        }
        if (!player.autoAscend) {
            document.getElementById("ascensionAutoEnable").textContent = "Auto Ascend [OFF]";
            document.getElementById("ascensionAutoEnable").style.border = "2px solid red"
        }

        for (let i = 1; i <= 2; i++) {
            toggleAntMaxBuy();
            toggleAntAutoSacrifice(0);
            toggleAntAutoSacrifice(1);
        }

        document.getElementById("historyTogglePerSecondButton").textContent = "Per second: " + (player.historyShowPerSecond ? "ON" : "OFF");
        document.getElementById("historyTogglePerSecondButton").style.borderColor = (player.historyShowPerSecond ? "green" : "red");

        if (!player.autoAscend) {
            document.getElementById("ascensionAutoEnable").textContent = "Auto Ascend [OFF]";
            document.getElementById("ascensionAutoEnable").style.border = "2px solid red"
        }

        player.autoResearch = Math.min(200, player.autoResearch)
        player.autoSacrifice = Math.min(5, player.autoSacrifice)


        if (player.researches[61] === 0) {
            document.getElementById('automaticobtainium').textContent = "[LOCKED - Buy Research 3x11]"
        }

        if (player.autoSacrificeToggle && player.autoSacrifice > 0.5) {
            document.getElementById("rune" + player.autoSacrifice).style.backgroundColor = "orange"
        }

        calculateOffline();
        toggleTalismanBuy(player.buyTalismanShardPercent);
        updateTalismanInventory();
        calculateObtainium();
        calculateAnts();
        calculateRuneLevels();
        resetHistoryRenderAllTables();
        c15RewardUpdate();
    }
    CSSAscend();
    CSSRuneBlessings();
    updateAchievementBG();

    const d = new Date()
    const h = d.getHours()
    const m = d.getMinutes()
    const s = d.getSeconds()
    player.dayTimer = (60 * 60 * 24 - (s + 60 * m + 60 * 60 * h))
}

/**
 * This function displays the numbers such as 1,234 or 1.00e1234 or 1.00e1.234M.
 * @param {number} input number/Decimal to be formatted
 * @param accuracy
 * how many decimal points that are to be displayed (Values <10 if !long, <1000 if long).
 * only works up to 305 (308 - 3), however it only worked up to ~14 due to rounding errors regardless
 * @param long dictates whether or not a given number displays as scientific at 1,000,000. This auto defaults to short if input >= 1e13
 */
export const format = (input: number, accuracy = 0, long = false): string => {
    if (typeof input !== 'number' || isNaN(input as any)) {
        return '0 [und.]';
    }

    let power;
    let mantissa;
    if (typeof input === 'number') {
        if (input === 0) {
            return '0';
        }

        // Gets power and mantissa if input is of type number and isn't 0
        power = Math.floor(Math.log10(Math.abs(input)));
        mantissa = input / Math.pow(10, power);
    }

    // This prevents numbers from jittering between two different powers by rounding errors
    if (mantissa > 9.9999999) {
        mantissa = 1;
        ++power;
    }

    if (mantissa < 1 && mantissa > 0.9999999) {
        mantissa = 1;
    }

    // If the power is less than -12 it's effectively 0
    if (power < -12) {
        return '0';
    } else if (power < 6 || (long && power < 13)) {
        // If the power is less than 6 or format long and less than 13 use standard formatting (123,456,789)
        // Gets the standard representation of the number, safe as power is guaranteed to be > -12 and < 13
        let standard = mantissa * Math.pow(10, power);
        let standardString;
        // Rounds up if the number experiences a rounding error
        if (standard - Math.floor(standard) > 0.9999999) {
            standard = Math.ceil(standard);
        }
        // If the power is less than 1 or format long and less than 3 apply toFixed(accuracy) to get decimal places
        if ((power < 1 || (long && power < 3)) && accuracy > 0) {
            standardString = standard.toFixed(accuracy);
        } else {
            // If it doesn't fit those criteria drop the decimal places
            standard = Math.floor(standard);
            standardString = standard.toString();
        }

        // Split it on the decimal place
        const [front, back] = standardString.split('.');
        // Apply a number group 3 comma regex to the front
        const frontFormatted = typeof BigInt === 'function'
            ? BigInt(front).toLocaleString() // TODO: use Intl to force en-US
            : front.replace(/(\d)(?=(\d{3})+$)/g, '$1,');

        // if the back is undefined that means there are no decimals to display, return just the front
        return !back 
            ? frontFormatted
            : `${frontFormatted}.${back}`;
    }
        // If it doesn't fit a notation then default to mantissa e power
        return `${mantissa}e${power}`;
}

export const formatTimeShort = (seconds: number, msMaxSeconds?: number): string => {
    return ((seconds >= 86400)
        ? format(Math.floor(seconds / 86400)) + "d"
        : '') +
        ((seconds >= 3600)
            ? format(Math.floor(seconds / 3600) % 24) + "h"
            : '') +
        ((seconds >= 60)
            ? format(Math.floor(seconds / 60) % 60) + "m"
            : '') +
        format(Math.floor(seconds) % 60) +
        ((msMaxSeconds && seconds < msMaxSeconds)
            ? "." + (Math.floor((seconds % 1) * 1000).toString().padStart(3, '0'))
            : '') + "s";
}

export const updateAllTick = (): void => {
    let a = 0;
    
    G['totalAccelerator'] = player.acceleratorBought;
    G['costDivisor'] = 1;

    if (player.upgrades[8] !== 0) {
        a += Math.floor(player.multiplierBought / 7);
    }
    if (player.upgrades[21] !== 0) {
        a += 5;
    }
    if (player.upgrades[22] !== 0) {
        a += 4;
    }
    if (player.upgrades[23] !== 0) {
        a += 3;
    }
    if (player.upgrades[24] !== 0) {
        a += 2;
    }
    if (player.upgrades[25] !== 0) {
        a += 1;
    }
    if (player.upgrades[27] !== 0) {
        a += Math.min(250, Math.floor(Math.pow(player.coins/1000, 1/3)) + Math.min(1750, Math.max(0, Math.floor(1/5 * Math.pow(player.coins / 1e3, 1/3)) - 50)));
    }
    if (player.upgrades[29] !== 0) {
        a += Math.floor(Math.min(2000, (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin) / 80))
    }
    if (player.upgrades[32] !== 0) {
        a += Math.min(500, 25 * Math.floor(Math.log10(player.prestigePoints)));
    }
    if (player.upgrades[45] !== 0) {
        a += Math.min(2500, 125 * Math.floor(Math.log10(player.transcendShards)));
    }
    if (player.achievements[5] !== 0) {
        a += Math.floor(player.firstOwnedCoin / 500)
    }
    if (player.achievements[12] !== 0) {
        a += Math.floor(player.secondOwnedCoin / 500)
    }
    if (player.achievements[19] !== 0) {
        a += Math.floor(player.thirdOwnedCoin / 500)
    }
    if (player.achievements[26] !== 0) {
        a += Math.floor(player.fourthOwnedCoin / 500)
    }
    if (player.achievements[33] !== 0) {
        a += Math.floor(player.fifthOwnedCoin / 500)
    }
    if (player.achievements[60] !== 0) {
        a += 2
    }
    if (player.achievements[61] !== 0) {
        a += 2
    }
    if (player.achievements[62] !== 0) {
        a += 2
    }

    a += 5 * CalcECC('transcend', player.challengecompletions[2])
    G['freeUpgradeAccelerator'] = a;
    a += G['totalAcceleratorBoost'] * (4 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20] + G['cubeBonusMultiplier'][1]);
    if (player.unlocks.prestige === true) {
        a += Math.floor(Math.pow(G['rune1level'] * G['effectiveLevelMult'] / 4, 1.25));
        a *= (1 + G['rune1level'] * 1 / 400 * G['effectiveLevelMult']);
    }
    
    calculateAcceleratorMultiplier();
    a *= G['acceleratorMultiplier']
    a = Math.pow(a, Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['maladaptivePower'][player.usedCorruptions[2]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))))
    a *= G['challenge15Rewards'].accelerator
    a = Math.floor(a)

    G['freeAccelerator'] = a;
    G['totalAccelerator'] += G['freeAccelerator'];

    G['tuSevenMulti'] = 1;


    if (player.upgrades[46] > 0.5) {
        G['tuSevenMulti'] = 1.05;
    }

    G['acceleratorPower'] = Math.pow(
        1.1 + G['tuSevenMulti'] * 
        (G['totalAcceleratorBoost'] / 100) 
        * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20), 
        1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7])
    );
    G['acceleratorPower'] += 1 / 200 * Math.floor(CalcECC('transcend', player.challengecompletions[2]) / 2) * 100 / 100
    for (let i = 1; i <= 5; i++) {
        if (player.achievements[7 * i - 4] > 0) {
            G['acceleratorPower'] += 0.0005 * i
        }
    }

    //No MA and Sadistic will always overwrite Transcend challenges starting in v2.0.0
    if (player.currentChallenge.reincarnation !== 7 && player.currentChallenge.reincarnation !== 10) {
        if (player.currentChallenge.transcension === 1) {
            G['acceleratorPower'] *= 25 / (50 + player.challengecompletions[1]);
            G['acceleratorPower'] += 0.55
            G['acceleratorPower'] = Math.max(1, G['acceleratorPower'])
        }
        if (player.currentChallenge.transcension === 2) {
            G['acceleratorPower'] = 1;
        }
        if (player.currentChallenge.transcension === 3) {
            G['acceleratorPower'] = 
                1.05 + 
                2 * G['tuSevenMulti'] * 
                (G['totalAcceleratorBoost'] / 300) * 
                (1 + CalcECC('transcend', player.challengecompletions[2]) / 20
            );
        }
    }
    if (player.currentChallenge.reincarnation === 7) {
        G['acceleratorPower'] = 1;
    }
    if (player.currentChallenge.reincarnation === 10) {
        G['acceleratorPower'] = 1;
    }

    if (player.currentChallenge.transcension !== 1) {
        G['acceleratorEffect'] = G['acceleratorPower'] * G['totalAccelerator'];
    }

    if (player.currentChallenge.transcension === 1) {
        G['acceleratorEffect'] = G['acceleratorPower'] * (G['totalAccelerator'] + G['totalMultiplier']);
    }
    G['acceleratorEffectDisplay'] = G['acceleratorPower'] * 100 - 100;
    if (player.currentChallenge.reincarnation === 10) {
        G['acceleratorEffect'] = 1;
    }
    G['generatorPower'] = 1;
    if (player.upgrades[11] > 0.5 && player.currentChallenge.reincarnation !== 7) {
        G['generatorPower'] = 1 + 0.02 * G['totalAccelerator']
    }

}

export const updateAllMultiplier = (): void => {
    let a = 0;

    if (player.upgrades[7] > 0) {
        a += Math.min(4, 1 + Math.floor(Math.log10(player.fifthOwnedCoin + 1)));
    }
    if (player.upgrades[9] > 0) {
        a += Math.floor(player.acceleratorBought / 10);
    }
    if (player.upgrades[21] > 0) {
        a += 1;
    }
    if (player.upgrades[22] > 0) {
        a += 1;
    }
    if (player.upgrades[23] > 0) {
        a += 1;
    }
    if (player.upgrades[24] > 0) {
        a += 1;
    }
    if (player.upgrades[25] > 0) {
        a += 1;
    }
    if (player.upgrades[28] > 0) {
        a += Math.min(1000, Math.floor((player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin) / 160))
    }
    if (player.upgrades[30] > 0) {
        a += Math.min(75, Math.floor(Math.log10(player.coins + 1))) + Math.min(925, Math.floor(Math.log10(player.coins + 1)));
    }
    if (player.upgrades[33] > 0) {
        a += G['totalAcceleratorBoost']
    }
    if (player.upgrades[49] > 0) {
        a += Math.min(50, Math.floor(Math.log10(player.transcendPoints + 1)));
    }
    if (player.upgrades[68] > 0) {
        a += Math.min(2500, Math.floor(Math.log10(G['taxdivisor'])))
    }
    if (player.challengecompletions[1] > 0) {
        a += 1
    }
    if (player.achievements[6] > 0.5) {
        a += Math.floor(player.firstOwnedCoin / 1000)
    }
    if (player.achievements[13] > 0.5) {
        a += Math.floor(player.secondOwnedCoin / 1000)
    }
    if (player.achievements[20] > 0.5) {
        a += Math.floor(player.thirdOwnedCoin / 1000)
    }
    if (player.achievements[27] > 0.5) {
        a += Math.floor(player.fourthOwnedCoin / 1000)
    }
    if (player.achievements[34] > 0.5) {
        a += Math.floor(player.fifthOwnedCoin / 1000)
    }
    if (player.achievements[57] > 0.5) {
        a += 1
    }
    if (player.achievements[58] > 0.5) {
        a += 1
    }
    if (player.achievements[59] > 0.5) {
        a += 1
    }
    a += 20 * player.researches[94] * Math.floor(
        (G['rune1level'] + G['rune2level'] + G['rune3level'] + G['rune4level'] + G['rune5level']) / 8
    );

    G['freeUpgradeMultiplier'] = a

    if (player.achievements[38] > 0.5) {
        a += Math.floor(Math.floor(
            G['rune2level'] / 10 * G['effectiveLevelMult']) * 
            Math.floor(1 + G['rune2level'] / 10 * G['effectiveLevelMult']) / 2
        ) * 100 / 100;
    }

    a *= (1 + player.achievements[57] / 100)
    a *= (1 + player.achievements[58] / 100)
    a *= (1 + player.achievements[59] / 100)
    a *= Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25])
    if (player.upgrades[34] > 0.5) {
        a *= 1.03 * 100 / 100
    }
    if (player.upgrades[35] > 0.5) {
        a *= 1.05 / 1.03 * 100 / 100
    }
    a *= (1 + 1 / 5 * player.researches[2] * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14])))
    a *= (1 + 1 / 20 * player.researches[11] + 1 / 25 * player.researches[12] + 1 / 40 * player.researches[13] + 3 / 200 * player.researches[14] + 1 / 200 * player.researches[15])
    a *= (1 + G['rune2level'] / 400 * G['effectiveLevelMult'])
    a *= (1 + 1 / 20 * player.researches[87])
    a *= (1 + 1 / 100 * player.researches[128])
    a *= (1 + 0.8 / 100 * player.researches[143])
    a *= (1 + 0.6 / 100 * player.researches[158])
    a *= (1 + 0.4 / 100 * player.researches[173])
    a *= (1 + 0.2 / 100 * player.researches[188])
    a *= (1 + 0.01 / 100 * player.researches[200])
    a *= (1 + 0.01 / 100 * player.cubeUpgrades[50])
    a *= calculateSigmoidExponential(40, (player.antUpgrades[5-1] + G['bonusant5']) / 1000 * 40 / 39)
    a *= G['cubeBonusMultiplier'][2]
    if ((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5) {
        a *= 1.25
    }
    a = Math.pow(a, Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['divisivenessPower'][player.usedCorruptions[1]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))))
    a *= G['challenge15Rewards'].multiplier
    a = Math.floor(a)
    G['freeMultiplier'] = a;
    G['totalMultiplier'] = G['freeMultiplier'] + player.multiplierBought;

    G['challengeOneLog'] = 3;

    let b = 0;
    let c = 0;
    b += Math.log(player.transcendShards + 1)/Math.log(3);
    b *= (1 + 11 * player.researches[33] / 100)
    b *= (1 + 11 * player.researches[34] / 100)
    b *= (1 + 11 * player.researches[35] / 100)
    b *= (1 + player.researches[89] / 5)
    b *= (1 + 10 * G['effectiveRuneBlessingPower'][2])

    c += Math.floor((0.1 * b * CalcECC('transcend', player.challengecompletions[1])))
    c += (CalcECC('transcend', player.challengecompletions[1]) * 10);
    G['freeMultiplierBoost'] = c;
    G['totalMultiplierBoost'] = Math.pow(Math.floor(b) + c, 1 + CalcECC('reincarnation', player.challengecompletions[7]) * 0.04);

    let c7 = 1
    if (player.challengecompletions[7] > 0.5) {
        c7 = 1.25
    }

    G['multiplierPower'] = 2 + 0.005 * G['totalMultiplierBoost'] * c7

    //No MA and Sadistic will always override Transcend Challenges starting in v2.0.0
    if (player.currentChallenge.reincarnation !== 7 && player.currentChallenge.reincarnation !== 10) {
        if (player.currentChallenge.transcension === 1) {
            G['multiplierPower'] = 1;
        }
        if (player.currentChallenge.transcension === 2) {
            G['multiplierPower'] = (1.25 + 0.0012 * (b + c) * c7)
        }
    }

    if (player.currentChallenge.reincarnation === 7) {
        G['multiplierPower'] = 1;
    }
    if (player.currentChallenge.reincarnation === 10) {
        G['multiplierPower'] = 1;
    }

    G['multiplierEffect'] = (1 + G['multiplierPower'] * G['totalMultiplier']);
}

export const multipliers = (): void => {
    let s = 1;
    let c = 1;
    let crystalExponent = 1 / 3
    crystalExponent += Math.min(10 + 0.05 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4) + 20 * calculateCorruptionPoints() / 400 * G['effectiveRuneSpiritPower'][3], 0.05 * player.crystalUpgrades[3])
    crystalExponent += 0.04 * CalcECC('transcend', player.challengecompletions[3])
    crystalExponent += 0.08 * player.researches[28]
    crystalExponent += 0.08 * player.researches[29]
    crystalExponent += 0.04 * player.researches[30]
    crystalExponent += 8 * player.cubeUpgrades[17]
    G['prestigeMultiplier'] = Math.pow(player.prestigeShards, crystalExponent) + 1;

    let c7 = 1;
    if (player.currentChallenge.reincarnation === 7) {
        c7 = 0.05
    }
    if (player.currentChallenge.reincarnation === 8) {
        c7 = 0
    }

    G['buildingPower'] = 
        1 + (1 - Math.pow(2, -1 / 160)) * c7 * Math.log10(
            player.reincarnationShards + 1) * 
            (1 + 1 / 20 * player.researches[36] + 
            1 / 40 * player.researches[37] + 1 / 40 * 
            player.researches[38]) + 
            (c7 + 0.2) * 0.25 / 1.2 * 
            CalcECC('reincarnation', player.challengecompletions[8]
        );

    G['buildingPower'] = Math.pow(G['buildingPower'], 1 + player.cubeUpgrades[12] * 0.09)
    G['buildingPower'] = Math.pow(G['buildingPower'], 1 + player.cubeUpgrades[36] * 0.05)
    G['reincarnationMultiplier'] = 1 + G['buildingPower'] * G['totalCoinOwned'];

    G['antMultiplier'] = Math.max(1, player.antPoints) * (calculateCrumbToCoinExp());

    s *= G['multiplierEffect'];
    s *= G['acceleratorEffect'];
    s *= G['prestigeMultiplier'];
    s *= G['reincarnationMultiplier'];
    s *= G['antMultiplier']
    // PLAT - check
    const first6CoinUp = (G['totalCoinOwned'] + 1) * (Math.min(2, 1 + .008 * G['totalCoinOwned']));

    if (player.upgrades[6] > 0.5) {
        s *= first6CoinUp;
    }
    if (player.upgrades[12] > 0.5) {
        s *= (Math.min(100, 1 + .01 * player.prestigeCount));
    }
    if (player.upgrades[20] > 0.5) {
        // PLAT - check
        s *= Math.pow(G['totalCoinOwned'] / 4 + 1, 0.5);
    }
    if (player.upgrades[41] > 0.5) {
        s *= 1;
    }
    if (player.upgrades[43] > 0.5) {
        s *= 1;
    }
    if (player.upgrades[48] > 0.5) {
        s *= 1
    }
    if (player.currentChallenge.reincarnation === 6) {
        s /= 1
    }
    if (player.currentChallenge.reincarnation === 7) {
        s /= 1
    }
    if (player.currentChallenge.reincarnation === 9) {
        s /= 1
    }
    if (player.currentChallenge.reincarnation === 10) {
        s /= 1
    }
    c = Math.pow(s, 1 + 0.001 * player.researches[17]);
    let lol = Math.pow(c, 1 + 0.025 * player.upgrades[123])
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[5] > 0) {
        lol = Math.pow(lol, 1.1)
    }
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[14] > 0) {
        lol = Math.pow(lol, 1 + 1 / 20 * player.usedCorruptions[9] * Math.log10(player.coins + 1) / (1e7 + Math.log10(player.coins + 1)))
    }
    lol = Math.pow(lol, G['challenge15Rewards'].coinExponent)
    G['globalCoinMultiplier'] = lol;
    G['globalCoinMultiplier'] = Math.pow(G['globalCoinMultiplier'], G['financialcollapsePower'][player.usedCorruptions[9]])

    G['coinOneMulti'] = 1;
    if (player.upgrades[1] > 0.5) {
        G['coinOneMulti'] *= first6CoinUp;
    }
    if (player.upgrades[10] > 0.5) {
        G['coinOneMulti'] *= 1;
    }
    if (player.upgrades[56] > 0.5) {
        G['coinOneMulti'] *= 1
    }

    G['coinTwoMulti'] = 1
    if (player.upgrades[2] > 0.5) {
        G['coinTwoMulti'] *= 1
    }
    if (player.upgrades[13] > 0.5) {
        G['coinTwoMulti'] *= 1
    }
    if (player.upgrades[19] > 0.5) {
        G['coinTwoMulti'] *= 1
    }
    if (player.upgrades[57] > 0.5) {
        G['coinTwoMulti'] *= 1
    }

    G['coinThreeMulti'] = 1
    if (player.upgrades[3] > 0.5) {
        G['coinThreeMulti'] *= 1
    }
    if (player.upgrades[18] > 0.5) {
        G['coinThreeMulti'] *= 1

    if (player.upgrades[58] > 0.5) {
        G['coinThreeMulti'] *= 1
    }

    G['coinFourMulti'] = 1
    if (player.upgrades[4] > 0.5) {
        G['coinFourMulti'] *= 1
    }
    if (player.upgrades[17] > 0.5) {
        G['coinFourMulti'] *= 1
    }
    if (player.upgrades[59] > 0.5) {
        G['coinFourMulti'] *= 1
    }

    G['coinFiveMulti'] = 1
    if (player.upgrades[5] > 0.5) {
        G['coinFiveMulti'] *= 1
    }
    if (player.upgrades[60] > 0.5) {
        G['coinFiveMulti'] *= 1
    }

    G['globalCrystalMultiplier'] = 1
    if (player.achievements[36] > 0.5) {
        G['globalCrystalMultiplier'] *= 1
    }
    if (player.achievements[37] > 0.5 && player.prestigePoints >= 10) {
        G['globalCrystalMultiplier'] *= 1
    }
    if (player.achievements[43] > 0.5) {
        G['globalCrystalMultiplier'] *= 1
    }
    if (player.upgrades[36] > 0.5) {
        G['globalCrystalMultiplier'] *= 1
    }
    if (player.upgrades[63] > 0.5) {
        G['globalCrystalMultiplier'] *= 1
    }
    if (player.researches[39] > 0.5) {
        G['globalCrystalMultiplier'] *= 1
    }

    G['globalCrystalMultiplier'] *= 1 
    G['globalCrystalMultiplier'] *= 1
    G['globalCrystalMultiplier'] *= 1
    G['globalCrystalMultiplier'] *= 1
    G['globalCrystalMultiplier'] *= 1
    G['globalCrystalMultiplier'] *= 1
    G['globalCrystalMultiplier'] *= 1
    G['globalCrystalMultiplier'] *= 1

    G['globalMythosMultiplier'] = 1

    if (player.upgrades[37] > 0.5) {
        G['globalMythosMultiplier'] *= 1
    }
    if (player.upgrades[42] > 0.5) {
        G['globalMythosMultiplier'] *= 1
    }
    if (player.upgrades[47] > 0.5) {
        G['globalMythosMultiplier'] *= 1
    }
    if (player.upgrades[51] > 0.5) {
        G['globalMythosMultiplier'] *= 1
    }
    if (player.upgrades[52] > 0.5) {
        G['globalMythosMultiplier'] *= 1
    }
    if (player.upgrades[64] > 0.5) {
        G['globalMythosMultiplier'] *= 1
    }
    if (player.researches[40] > 0.5) {
        G['globalMythosMultiplier'] *= 1
    }
    G['grandmasterMultiplier'] = 1;
    G['totalMythosOwned'] = player.firstOwnedMythos + player.secondOwnedMythos + player.thirdOwnedMythos + player.fourthOwnedMythos + player.fifthOwnedMythos;

    G['mythosBuildingPower'] = 1 + (CalcECC('transcend', player.challengecompletions[3]) / 200);
    G['challengeThreeMultiplier'] *= 1

    G['grandmasterMultiplier'] *= 1

    G['mythosupgrade13'] = 1;
    G['mythosupgrade14'] = 1;
    G['mythosupgrade15'] = 1;
    if (player.upgrades[53] === 1) {
        G['mythosupgrade13'] *= 1
    }
    if (player.upgrades[54] === 1) {
        G['mythosupgrade14'] *= 1
    }
    if (player.upgrades[55] === 1) {
        G['mythosupgrade15'] *= 1
    }

    G['globalAntMult'] = 1;
    G['globalAntMult'] *= 1
    if (player.upgrades[76] === 1) {
        G['globalAntMult'] *= 1
    }
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    if (player.achievements[169] === 1) {
        G['globalAntMult'] *= 1
    }
    if (player.achievements[171] === 1) {
        G['globalAntMult'] *= 1
    }
    if (player.achievements[172] === 1) {
        G['globalAntMult'] *= 1
    }
    if (player.upgrades[39] === 1) {
        G['globalAntMult'] *= 1
    }
    G['globalAntMult'] *= 1
    G['globalAntMult'] *= 1
    if (player.researches[147] > 0) {
        G['globalAntMult'] *= 1
    }
    if (player.researches[177] > 0) {
        G['globalAntMult'] *= 1
    }

    if (player.currentChallenge.ascension === 12) {
        G['globalAntMult'] = Math.pow(G['globalAntMult'], 0.5)
    }
    if (player.currentChallenge.ascension === 13) {
        G['globalAntMult'] = Math.pow(G['globalAntMult'], 0.23)
    }
    if (player.currentChallenge.ascension === 14) {
        G['globalAntMult'] = Math.pow(G['globalAntMult'], 0.2)
    }

    G['globalAntMult'] = Math.pow(G['globalAntMult'], 1 - 0.9 / 90 * Math.min(99, sumContents(player.usedCorruptions)))
    G['globalAntMult'] = Math.pow(G['globalAntMult'], G['extinctionMultiplier'][player.usedCorruptions[7]])
    G['globalAntMult'] *= 1

    if (player.platonicUpgrades[12] > 0) {
        G['globalAntMult'] *= 1
    }
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[10] > 0) {
        G['globalAntMult'] *= 1
    }

    G['globalConstantMult'] = 1
    G['globalConstantMult'] *= 1
    G['globalConstantMult'] *= 1
    G['globalConstantMult'] *= 1
    G['globalConstantMult'] *= 1
    G['globalConstantMult'] *= 1
    G['globalConstantMult'] *= 1
    G['globalConstantMult'] *= 1
    G['globalConstantMult'] *= 1
    if (player.platonicUpgrades[5] > 0) {
        G['globalConstantMult'] *= 1
    }
    if (player.platonicUpgrades[10] > 0) {
        G['globalConstantMult'] *= 1
    }
    if (player.platonicUpgrades[15] > 0) {
        G['globalConstantMult'] *= 1
    }
}
}
export const resourceGain = (dt: number): void => {

    calculateTotalCoinOwned();
    calculateTotalAcceleratorBoost();

    updateAllTick();
    updateAllMultiplier();
    multipliers();
    calculatetax();
    if (G['produceTotal'] >= 0.001) {
        const addcoin = Math.min(G['produceTotal'] / (G['taxdivisor']), G['maxexponent'] / G['taxdivisorcheck'])
        player.coins += (addcoin * dt / 0.025);
        player.coinsThisPrestige += (addcoin * dt / 0.025);
        player.coinsThisTranscension += (addcoin * dt / 0.025);
        player.coinsThisReincarnation += (addcoin * dt / 0.025);
        player.coinsTotal += (addcoin * dt / 0.025);
    }

    resetCurrency();
    if (player.upgrades[93] === 1 && player.coinsThisPrestige >= 1e16) {
        player.prestigePoints += (Math.floor(G['prestigePointGain'] / 4000 * (dt / 0.025)))
    }
    if (player.upgrades[100] === 1 && player.coinsThisTranscension >= 1e100) {
        player.transcendPoints += (Math.floor(G['transcendPointGain'] / 4000 * (dt / 0.025)))
    }
    if (player.cubeUpgrades[28] > 0 && player.transcendShards >= 1e300) {
        player.reincarnationPoints += (Math.floor(G['reincarnationPointGain'] / 4000 * (dt / 0.025)))
    }
    G['produceFirstDiamonds'] = (player.firstGeneratedDiamonds + player.firstOwnedDiamonds) * (player.firstProduceDiamonds) * (G['globalCrystalMultiplier'])
    G['produceSecondDiamonds'] = (player.secondGeneratedDiamonds + player.secondOwnedDiamonds) * (player.secondProduceDiamonds) * (G['globalCrystalMultiplier'])
    G['produceThirdDiamonds'] = (player.thirdGeneratedDiamonds + player.thirdOwnedDiamonds) * (player.thirdProduceDiamonds) * (G['globalCrystalMultiplier'])
    G['produceFourthDiamonds'] = (player.fourthGeneratedDiamonds + player.fourthOwnedDiamonds) * (player.fourthProduceDiamonds) * (G['globalCrystalMultiplier'])
    G['produceFifthDiamonds'] = (player.fifthGeneratedDiamonds + player.fifthOwnedDiamonds) * (player.fifthProduceDiamonds) * (G['globalCrystalMultiplier'])

    player.fourthGeneratedDiamonds += (G['produceFifthDiamonds'] * (dt / 0.025))
    player.thirdGeneratedDiamonds += (G['produceFourthDiamonds'] * (dt / 0.025))
    player.secondGeneratedDiamonds += (G['produceThirdDiamonds'] * (dt / 0.025))
    player.firstGeneratedDiamonds += (G['produceSecondDiamonds'] * (dt / 0.025))
    G['produceDiamonds'] = G['produceFirstDiamonds'];

    if (player.currentChallenge.transcension !== 3 && player.currentChallenge.reincarnation !== 10) {
        player.prestigeShards = player.prestigeShards += (G['produceDiamonds'] * (dt / 0.025))
    }

    G['produceFifthMythos'] = (player.fifthGeneratedMythos + player.fifthOwnedMythos) * (player.fifthProduceMythos) * (G['globalMythosMultiplier']) * (G['grandmasterMultiplier']) * (G['mythosupgrade15'])
    G['produceFourthMythos'] = (player.fourthGeneratedMythos + player.fourthOwnedMythos) * (player.fourthProduceMythos) * (G['globalMythosMultiplier'])
    G['produceThirdMythos'] = (player.thirdGeneratedMythos + player.thirdOwnedMythos) * (player.thirdProduceMythos) * (G['globalMythosMultiplier']) * (G['mythosupgrade14'])
    G['produceSecondMythos'] = (player.secondGeneratedMythos + player.secondOwnedMythos) * (player.secondProduceMythos) * (G['globalMythosMultiplier'])
    G['produceFirstMythos'] = (player.firstGeneratedMythos + player.firstOwnedMythos) * (player.firstProduceMythos) * (G['globalMythosMultiplier']) * (G['mythosupgrade13'])
    player.fourthGeneratedMythos += (G['produceFifthMythos'] * (dt / 0.025));
    player.thirdGeneratedMythos += (G['produceFourthMythos'] * (dt / 0.025));
    player.secondGeneratedMythos += (G['produceThirdMythos'] * (dt / 0.025));
    player.firstGeneratedMythos += (G['produceSecondMythos'] * (dt / 0.025));


    G['produceMythos'] = 0;
    G['produceMythos'] = (player.firstGeneratedMythos + player.firstOwnedMythos) * (player.firstProduceMythos) * (G['globalMythosMultiplier']) * (G['mythosupgrade13']);
    G['producePerSecondMythos'] = G['produceMythos'] * 40

    let pm = 1;
    if (player.upgrades[67] > 0.5) {
        pm *= 1 + 0.03 * (player.firstOwnedParticles + player.secondOwnedParticles + player.thirdOwnedParticles + player.fourthOwnedParticles + player.fifthOwnedParticles)
    }
    G['produceFifthParticles'] = (player.fifthGeneratedParticles + player.fifthOwnedParticles) * (player.fifthProduceParticles)
    G['produceFourthParticles'] = (player.fourthGeneratedParticles + player.fourthOwnedParticles) * (player.fourthProduceParticles)
    G['produceThirdParticles'] = (player.thirdGeneratedParticles + player.thirdOwnedParticles) * (player.thirdProduceParticles)
    G['produceSecondParticles'] = (player.secondGeneratedParticles + player.secondOwnedParticles) * (player.secondProduceParticles)
    G['produceFirstParticles'] = (player.firstGeneratedParticles + player.firstOwnedParticles) * (player.firstProduceParticles) * (pm)
    player.fourthGeneratedParticles += (G['produceFifthParticles'] * (dt / 0.025));
    player.thirdGeneratedParticles += (G['produceFourthParticles'] * (dt / 0.025));
    player.secondGeneratedParticles += (G['produceThirdParticles'] * (dt / 0.025));
    player.firstGeneratedParticles += (G['produceSecondParticles'] * (dt / 0.025));

    G['produceParticles'] = 0;
    G['produceParticles'] = (player.firstGeneratedParticles + player.firstOwnedParticles) * (player.firstProduceParticles) * (pm);
    G['producePerSecondParticles'] = G['produceParticles'] * (40);

    if (player.currentChallenge.transcension !== 3 && player.currentChallenge.reincarnation !== 10) {
        player.transcendShards += G['produceMythos'] * (dt / 0.025);
    }
    if (player.currentChallenge.reincarnation !== 10) {
        player.reincarnationShards += G['produceParticles'] * (dt / 0.025)
    }

    G['antEightProduce'] = (player.eighthGeneratedAnts + player.eighthOwnedAnts) * (player.eighthProduceAnts) * (G['globalAntMult'])
    G['antSevenProduce'] = (player.seventhGeneratedAnts + player.seventhOwnedAnts) * (player.seventhProduceAnts) * (G['globalAntMult'])
    G['antSixProduce'] = (player.sixthGeneratedAnts + player.sixthOwnedAnts) * (player.sixthProduceAnts) * (G['globalAntMult'])
    G['antFiveProduce'] = (player.fifthGeneratedAnts + player.fifthOwnedAnts) * (player.fifthProduceAnts) * (G['globalAntMult'])
    G['antFourProduce'] = (player.fourthGeneratedAnts + player.fourthOwnedAnts) * (player.fourthProduceAnts) * (G['globalAntMult'])
    G['antThreeProduce'] = (player.thirdGeneratedAnts + player.thirdOwnedAnts) * (player.thirdProduceAnts) * (G['globalAntMult'])
    G['antTwoProduce'] = (player.secondGeneratedAnts + player.secondOwnedAnts) * (player.secondProduceAnts) * (G['globalAntMult'])
    G['antOneProduce'] = (player.firstGeneratedAnts + player.firstOwnedAnts) * (player.firstProduceAnts) * (G['globalAntMult'])
    player.seventhGeneratedAnts += (G['antEightProduce'] * (dt / 1))
    player.sixthGeneratedAnts += (G['antSevenProduce'] * (dt / 1))
    player.fifthGeneratedAnts += (G['antSixProduce'] * (dt / 1))
    player.fourthGeneratedAnts += (G['antFiveProduce'] * (dt / 1))
    player.thirdGeneratedAnts += (G['antFourProduce'] * (dt / 1))
    player.secondGeneratedAnts += (G['antThreeProduce'] * (dt / 1))
    player.firstGeneratedAnts += (G['antTwoProduce'] * (dt / 1))

    player.antPoints += (G['antOneProduce'] * (dt / 1))

    for (let i = 1; i <= 5; i++) {
        G['ascendBuildingProduction'][G['ordinals'][5 - i] as keyof typeof G['ascendBuildingProduction']] = (player['ascendBuilding' + (6 - i)]['generated']).add(player['ascendBuilding' + (6 - i)]['owned']).times(player['ascendBuilding' + i]['multiplier']).times(G['globalConstantMult'])

        if (i !== 5) {
            player['ascendBuilding' + (5 - i)]['generated'] += (G['ascendBuildingProduction'][G['ordinals'][5 - i] as keyof typeof G['ascendBuildingProduction']] * (dt))
        }
    }

    player.ascendShards += (G['ascendBuildingProduction'].first * dt)

    if (player.ascensionCount > 0) {
        ascensionAchievementCheck(2)
    }

    if (player.researches[71] > 0.5 && player.challengecompletions[1] < (Math.min(player.highestchallengecompletions[1], 25 + 5 * player.researches[66] + 925 * player.researches[105])) && player.coins >= 1.25 * G['challengeBaseRequirements'][0] * Math.pow(1 + player.challengecompletions[1], 2)) {
        player.challengecompletions[1] += 1;
        challengeDisplay(1, false);
        challengeachievementcheck(1, true)
        updateChallengeLevel(1)
    }
    if (player.researches[72] > 0.5 && player.challengecompletions[2] < (Math.min(player.highestchallengecompletions[2], 25 + 5 * player.researches[67] + 925 * player.researches[105])) && player.coins >= 1.6 * G['challengeBaseRequirements'][1] * Math.pow(1 + player.challengecompletions[2], 2)) {
        player.challengecompletions[2] += 1
        challengeDisplay(2, false)
        challengeachievementcheck(2, true)
        updateChallengeLevel(2)
    }
    if (player.researches[73] > 0.5 && player.challengecompletions[3] < (Math.min(player.highestchallengecompletions[3], 25 + 5 * player.researches[68] + 925 * player.researches[105])) && player.coins >= 1.7 * G['challengeBaseRequirements'][2] * Math.pow(1 + player.challengecompletions[3], 2)) {
        player.challengecompletions[3] += 1
        challengeDisplay(3, false)
        challengeachievementcheck(3, true)
        updateChallengeLevel(3)
    }
    if (player.researches[74] > 0.5 && player.challengecompletions[4] < (Math.min(player.highestchallengecompletions[4], 25 + 5 * player.researches[69] + 925 * player.researches[105])) && player.coins >= 1.45 * G['challengeBaseRequirements'][3] * Math.pow(1 + player.challengecompletions[4], 2)) {
        player.challengecompletions[4] += 1
        challengeDisplay(4, false)
        challengeachievementcheck(4, true)
        updateChallengeLevel(4)
    }
    if (player.researches[75] > 0.5 && player.challengecompletions[5] < (Math.min(player.highestchallengecompletions[5], 25 + 5 * player.researches[70] + 925 * player.researches[105])) && player.coins >= 2 * G['challengeBaseRequirements'][4] * Math.pow(1 + player.challengecompletions[5], 2)) {
        player.challengecompletions[5] += 1
        challengeDisplay(5, false)
        challengeachievementcheck(5, true)
        updateChallengeLevel(5)
    }

    if (player.coins >= 10 && player.unlocks.coinone === false) {
        player.unlocks.coinone = true;
        revealStuff();
    }
    if (player.coins >= 200 && player.unlocks.cointwo === false) {
        player.unlocks.cointwo = true;
        revealStuff();
    }
    if (player.coins >= 4000 && player.unlocks.cointhree === false) {
        player.unlocks.cointhree = true;
        revealStuff();
    }
    if (player.coins >= 80000 && player.unlocks.coinfour === false) {
        player.unlocks.coinfour = true;
        revealStuff();
    }
    if (player.antPoints >= 3 && player.achievements[169] === 0) {
        achievementaward(169)
    }
    if (player.antPoints > 1e5 && player.achievements[170] === 0) {
        achievementaward(170)
    }
    if (player.antPoints > 6e9 && player.achievements[171] === 0) {
        achievementaward(171)
    }
    if (player.antPoints > 1e13 && player.achievements[172] === 0) {
        achievementaward(172)
    }
    if (player.antPoints > 1e22 && player.achievements[173] === 0) {
        achievementaward(173)
    }
    if (player.antPoints > 1e30 && player.achievements[174] === 0) {
        achievementaward(174)
    }
    if (player.antPoints > 1e40 && player.achievements[175] === 0) {
        achievementaward(175)
    }

    const chal = player.currentChallenge.transcension;
    const reinchal = player.currentChallenge.reincarnation;
    const ascendchal = player.currentChallenge.ascension;
    if (chal !== 0) {
        if (player.coinsThisTranscension >= challengeRequirement(chal, player.challengecompletions[chal], chal)) { 
            resetCheck('challenge', false);
            G['autoChallengeTimerIncrement'] = 0;
        }
    }
    if (reinchal < 9 && reinchal !== 0) {
        if (player.transcendShards >= challengeRequirement(reinchal, player.challengecompletions[reinchal], reinchal)) {
            resetCheck('reincarnationchallenge', false)
            G['autoChallengeTimerIncrement'] = 0;
            if (player.challengecompletions[reinchal] >= (25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension)) {
                player.autoChallengeIndex += 1
            }
        }
    }
    if (reinchal >= 9) {
        if (player.coins >= challengeRequirement(reinchal, player.challengecompletions[reinchal], reinchal)) {
            resetCheck('reincarnationchallenge', false)
            G['autoChallengeTimerIncrement'] = 0;
            if (player.challengecompletions[reinchal] >= (25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension)) {
                player.autoChallengeIndex += 1
                if (player.autoChallengeIndex > 10) {
                    player.autoChallengeIndex = 1
                }
            }
        }
    }
    if (ascendchal !== 0 && ascendchal < 15) {
        if (player.challengecompletions[10] >= challengeRequirement(ascendchal, player.challengecompletions[ascendchal], ascendchal)) {
            resetCheck('ascensionChallenge', false)
            challengeachievementcheck(ascendchal, true)
        }
    }
    if (ascendchal === 15) {
        if (player.coins > challengeRequirement(ascendchal, player.challengecompletions[ascendchal], ascendchal)) {
            resetCheck('ascensionChallenge', false)
        }
    }
}

export const resetCurrency = (): void => {
    let prestigePow = 0.5 + CalcECC('transcend', player.challengecompletions[5]) / 100
    let transcendPow = 0.03

    // Calculates the conversion exponent for resets (Challenges 5 and 10 reduce the exponent accordingly).
    if (player.currentChallenge.transcension === 5) {
        prestigePow = 0.01 / (1 + player.challengecompletions[5]);
        transcendPow = 0.001;
    }
    if (player.currentChallenge.reincarnation === 10) {
        prestigePow = (1e-4) / (1 + player.challengecompletions[10]);
        transcendPow = 0.001;
    }
    prestigePow *= G['deflationMultiplier'][player.usedCorruptions[6]]
    //Prestige Point Formulae
    G['prestigePointGain'] = Math.floor(Math.pow(player.coinsThisPrestige / 1e12, prestigePow));
    if (player.upgrades[16] > 0.5 && player.currentChallenge.transcension !== 5 && player.currentChallenge.reincarnation !== 10) {
        G['prestigePointGain'] *= (Math.min(Math.pow(10, 100), Math.pow(G['acceleratorEffect'], 1 / 3 * G['deflationMultiplier'][player.usedCorruptions[6]])));
    }

    //Transcend Point Formulae
    G['transcendPointGain'] = Math.floor(Math.pow(player.coinsThisTranscension / 1e100, transcendPow));
    if (player.upgrades[44] > 0.5 && player.currentChallenge.transcension !== 5 && player.currentChallenge.reincarnation !== 10) {
        G['transcendPointGain'] *= Math.min(100, 1 + .01 * player.transcendCount);
    }

    //Reincarnation Point Formulae
    G['reincarnationPointGain'] = Math.floor(Math.pow(player.transcendShards / 1e12, 0.01));
    if (player.currentChallenge.reincarnation !== 0) {
        G['reincarnationPointGain'] = Math.pow(G['reincarnationPointGain'], 0.01)
    }
    if (player.achievements[50] === 1) {
        G['reincarnationPointGain'] *= 2;
    }
    if (player.upgrades[65] > 0.5) {
        G['reincarnationPointGain'] *= 5;
    }
    if (player.currentChallenge.ascension === 12) {
        G['reincarnationPointGain'] = 0;
    }
}

export const resetCheck = async (i: string, manual = true, leaving = false): Promise<void> => {
    if (i === 'prestige') {
        if (player.coinsThisPrestige >= 1e16 || G['prestigePointGain'] >= 100) {
            if (manual) {
                resetConfirmation('prestige');
            } else {
                resetachievementcheck(1);
                reset("prestige");
            }
        }
    }
    if (i === 'transcend') {
        if ((player.coinsThisTranscension >= 1e100 || G['transcendPointGain'] >= 0.5) && player.currentChallenge.transcension === 0) {
            if (manual) {
                resetConfirmation('transcend');
            }
            if (!manual) {
                resetachievementcheck(2);
                reset("transcension");
            }
        }
    }
    if (i === 'challenge') {
        const q = player.currentChallenge.transcension;
        const maxCompletions = getMaxChallenges(q);
        if (player.currentChallenge.transcension !== 0) {
            const reqCheck = (comp: number) => player.coinsThisTranscension >= (challengeRequirement(q, comp, q));

            if (reqCheck(player.challengecompletions[q]) && player.challengecompletions[q] < maxCompletions) {
                const maxInc = player.shopUpgrades.instantChallenge > 0 && player.currentChallenge.ascension !== 13 ? 10 : 1; // TODO: Implement the shop upgrade levels here
                let counter = 0;
                let comp = player.challengecompletions[q];
                while (counter < maxInc) {
                    if (reqCheck(comp) && comp < maxCompletions) {
                        comp++;
                    }
                    counter++;
                }
                player.challengecompletions[q] = comp;
                challengeDisplay(q, false)
                updateChallengeLevel(q)
            }
            if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                while (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                    player.highestchallengecompletions[q] += 1;
                    challengeDisplay(q, false)
                    updateChallengeLevel(q)
                    highestChallengeRewards(q, player.highestchallengecompletions[q])
                    calculateCubeBlessings();
                }

            }

            challengeachievementcheck(q);
            if (player.shopUpgrades.instantChallenge === 0 || leaving) {
                reset("transcensionChallenge", false, "leaveChallenge");
                player.transcendCount -= 1;
            }

        }
        if (!player.retrychallenges || manual || player.challengecompletions[q] >= (maxCompletions)) {
            player.currentChallenge.transcension = 0;
            updateChallengeDisplay();
        }
    }

    if (i === "reincarnate") {
        if (G['reincarnationPointGain'] >= 0.5 && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
            if (manual) {
                resetConfirmation('reincarnate');
            }
            if (!manual) {
                resetachievementcheck(3);
                reset("reincarnation");
            }
        }
    }
    if (i === "reincarnationchallenge" && player.currentChallenge.reincarnation !== 0) {
        const q = player.currentChallenge.reincarnation;
        const maxCompletions = getMaxChallenges(q);
        if (player.currentChallenge.transcension !== 0) {
            player.currentChallenge.transcension = 0
        }
        const reqCheck = (comp: number) => {
            if (q <= 8) {
                return player.transcendShards >= (challengeRequirement(q, comp, q))
            } else { // challenges 9 and 10
                return player.coins >= (challengeRequirement(q, comp, q))
            }
        }
        if (reqCheck(player.challengecompletions[q]) && player.challengecompletions[q] < maxCompletions) {
            const maxInc = player.shopUpgrades.instantChallenge > 0 && player.currentChallenge.ascension !== 13 ? 10 : 1; // TODO: Implement the shop upgrade levels here
            let counter = 0;
            let comp = player.challengecompletions[q];
            while (counter < maxInc) {
                if (reqCheck(comp) && comp < maxCompletions) {
                    comp++;
                }
                counter++;
            }
            player.challengecompletions[q] = comp;
            challengeDisplay(q, true);
            updateChallengeLevel(q);
        }
        if (player.shopUpgrades.instantChallenge === 0 || leaving) { // TODO: Implement the upgrade levels here
            reset("reincarnationChallenge", false, "leaveChallenge");
            player.reincarnationCount -= 1;
        }
        challengeachievementcheck(q);
        if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
            while (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                player.highestchallengecompletions[q] += 1;
                highestChallengeRewards(q, player.highestchallengecompletions[q])
                calculateHypercubeBlessings();
                calculateTesseractBlessings();
                calculateCubeBlessings();
            }
        }
        if (!player.retrychallenges || manual || player.challengecompletions[q] > 24 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension + 5 * player.platonicUpgrades[5] + 5 * player.platonicUpgrades[10] + 10 * player.platonicUpgrades[15]) {
            reset("reincarnationChallenge", false, "leaveChallenge");
            player.currentChallenge.reincarnation = 0;
            if (player.shopUpgrades.instantChallenge > 0) {
                for (let i = 1; i <= 5; i++) {
                    player.challengecompletions[i] = player.highestchallengecompletions[i];
                }
            }
            updateChallengeDisplay();
            calculateRuneLevels();
            calculateAnts();
        }
    }

    if (i === "ascend") {
        if (player.challengecompletions[10] > 0) {
            if (manual) {
                resetConfirmation('ascend');
            }
        }
    }

    if (i === "ascensionChallenge" && player.currentChallenge.ascension !== 0) {
        let conf = true
        if (manual) {
            conf = await Confirm('Are you absolutely sure that you want to exit the Ascension Challenge? You will need to clear challenge 10 again before you can attempt the challenge again!')
        }
        if (!conf) {
            return;
        }
        const a = player.currentChallenge.ascension;
        const r = player.currentChallenge.reincarnation;
        const t = player.currentChallenge.transcension;

        if (player.challengecompletions[10] >= 50 && a === 11 && player.usedCorruptions[7] >= 5 && player.achievements[247] < 1) {
            achievementaward(247)
        }

        const maxCompletions = getMaxChallenges(a)
        if (a !== 0 && a < 15) {
            if (player.challengecompletions[10] >= challengeRequirement(a, player.challengecompletions[a], a) && player.challengecompletions[a] < maxCompletions) {
                player.challengecompletions[a] += 1;
            }
        }
        if (a === 15) {
            if (player.coins >= challengeRequirement(a, player.challengecompletions[a], a) && player.challengecompletions[a] < maxCompletions) {
                player.challengecompletions[a] += 1;
            } else {
                if (player.coins >= player.challenge15Exponent) {
                    player.challenge15Exponent = player.coins + 1;
                    c15RewardUpdate();
                }
            }
        }
        if (r !== 0) {
            // bandaid
            if (typeof player.currentChallenge === 'string') {
                player.currentChallenge = { ...blankSave.currentChallenge };
            }
        }
        if (t !== 0) {
            player.currentChallenge.transcension = 0;
        }
        challengeDisplay(a, true)
        reset("ascensionChallenge")

        if (player.challengecompletions[a] > player.highestchallengecompletions[a]) {
            player.highestchallengecompletions[a] += 1;
            player.wowHypercubes += 1;
        }

        if (!player.retrychallenges || manual || player.challengecompletions[a] >= maxCompletions || a === 15) {
            player.currentChallenge.ascension = 0;
        }
        updateChallengeDisplay();
        challengeachievementcheck(a, true)
    }
}

export const resetConfirmation = async (i: string): Promise<void> => {
    if (i === 'prestige') {
        if (player.toggles[28] === true) {
            const r = await Confirm("Prestige will reset coin upgrades, coin producers AND crystals. The first prestige unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
            if (r === true) {
                resetachievementcheck(1);
                reset("prestige");
            }
        } else {
            resetachievementcheck(1);
            reset("prestige");
        }
    }
    if (i === 'transcend') {
        if (player.toggles[29] === true) {
            const z = await Confirm("Transcends will reset coin and prestige upgrades, coin producers, crystal producers AND diamonds. The first transcension unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
            if (z === true) {
                resetachievementcheck(2);
                reset("transcension");
            }
        } else {
            resetachievementcheck(2);
            reset("transcension");
        }
    }
    if (i === 'reincarnate') {
        if (player.currentChallenge.ascension !== 12) {
            if (player.toggles[30] === true) {
                const z = await Confirm("Reincarnating will reset EVERYTHING but in return you will get extraordinarily powerful Particles, and unlock some very strong upgrades and some new features. would you like to Reincarnate? [Disable this message in settings]")
                if (z === true) {
                    resetachievementcheck(3);
                    reset("reincarnation");
                }
            } else {
                resetachievementcheck(3);
                reset("reincarnation");
            }
        }
    }
    if (i === 'ascend') {
        const z = !player.toggles[31] || 
                  await Confirm("Ascending will reset all buildings, rune levels [NOT CAP!], talismans, most researches, and the anthill feature for Cubes of Power. Continue? [It is strongly advised you get R5x24 first.]")
        if (z) {
            reset("ascension");
        }
    }
}

export const updateAll = (): void => {
    G['uFourteenMulti'] = 1;
    G['uFifteenMulti'] = 1;

    if (player.upgrades[14] > 0.5) {
        G['uFourteenMulti'] = 1 + 0.15 * G['freeAccelerator']
    }
    if (player.upgrades[15] > 0.5) {
        G['uFifteenMulti'] = 1 + 0.15 * G['freeAccelerator']
    }

    if (player.researches[200] >= 1e5 && player.achievements[250] < 1) {
        achievementaward(250)
    }
    if (player.cubeUpgrades[50] >= 1e5 && player.achievements[251] < 1) {
        achievementaward(251)
    }

//Autobuy "Building" Tab

    if (player.toggles[1] === true && player.upgrades[81] === 1 && player.coins >= player.firstCostCoin) {
        buyMax('first', 'Coin', 1, 100)
    }
    if (player.toggles[2] === true && player.upgrades[82] === 1 && player.coins >= (player.secondCostCoin)) {
        buyMax('second', 'Coin', 2, 2e3)
    }
    if (player.toggles[3] === true && player.upgrades[83] === 1 && player.coins >= (player.thirdCostCoin)) {
        buyMax('third', 'Coin', 3, 4e4)
    }
    if (player.toggles[4] === true && player.upgrades[84] === 1 && player.coins >= (player.fourthCostCoin)) {
        buyMax('fourth', 'Coin', 4, 8e5)
    }
    if (player.toggles[5] === true && player.upgrades[85] === 1 && player.coins >= (player.fifthCostCoin)) {
        buyMax('fifth', 'Coin', 5, 1.6e7)
    }
    if (player.toggles[6] === true && player.upgrades[86] === 1 && player.coins >= (player.acceleratorCost)) {
        buyAccelerator(true);
    }
    if (player.toggles[7] === true && player.upgrades[87] === 1 && player.coins >= (player.multiplierCost)) {
        buyMultiplier(true);
    }
    if (player.toggles[8] === true && player.upgrades[88] === 1 && player.prestigePoints >= (player.acceleratorBoostCost)) {
        boostAccelerator(true);
    }

//Autobuy "Prestige" Tab

    if (player.toggles[10] === true && player.achievements[78] === 1 && player.prestigePoints >= (player.firstCostDiamonds)) {
        buyMax('first', 'Diamonds', 1, 1e2)
    }
    if (player.toggles[11] === true && player.achievements[85] === 1 && player.prestigePoints >= (player.secondCostDiamonds)) {
        buyMax('second', 'Diamonds', 3, 1e5)
    }
    if (player.toggles[12] === true && player.achievements[92] === 1 && player.prestigePoints >= (player.thirdCostDiamonds)) {
        buyMax('third', 'Diamonds', 6, 1e15)
    }
    if (player.toggles[13] === true && player.achievements[99] === 1 && player.prestigePoints >= (player.fourthCostDiamonds)) {
        buyMax('fourth', 'Diamonds', 10, 1e40)
    }
    if (player.toggles[14] === true && player.achievements[106] === 1 && player.prestigePoints >= (player.fifthCostDiamonds)) {
        buyMax('fifth', 'Diamonds', 15, 1e100)
    }

    let c = 0;
    c += Math.floor(G['rune3level'] / 16 * G['effectiveLevelMult']) * 100 / 100
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
        c += 10
    }
    if (player.achievements[79] > 0.5 && player.prestigeShards >= (G['crystalUpgradesCost'][0] + G['crystalUpgradeCostIncrement'][0] * Math.floor(Math.pow(player.crystalUpgrades[0] - 0.5 - c, 2) / 2))) {
        buyCrystalUpgrades(1, true)
    }
    if (player.achievements[86] > 0.5 && player.prestigeShards >= (G['crystalUpgradesCost'][1] + G['crystalUpgradeCostIncrement'][1] * Math.floor(Math.pow(player.crystalUpgrades[1] - 0.5 - c, 2) / 2))) {
        buyCrystalUpgrades(2, true)
    }
    if (player.achievements[93] > 0.5 && player.prestigeShards >= (G['crystalUpgradesCost'][2] + G['crystalUpgradeCostIncrement'][2] * Math.floor(Math.pow(player.crystalUpgrades[2] - 0.5 - c, 2) / 2))) {
        buyCrystalUpgrades(3, true)
    }
    if (player.achievements[100] > 0.5 && player.prestigeShards >= (G['crystalUpgradesCost'][3] + G['crystalUpgradeCostIncrement'][3] * Math.floor(Math.pow(player.crystalUpgrades[3] - 0.5 - c, 2) / 2))) {
        buyCrystalUpgrades(4, true)
    }
    if (player.achievements[107] > 0.5 && player.prestigeShards >= (G['crystalUpgradesCost'][4] + G['crystalUpgradeCostIncrement'][4] * Math.floor(Math.pow(player.crystalUpgrades[4] - 0.5 - c, 2) / 2))) {
        buyCrystalUpgrades(5, true)
    }

//Autobuy "Transcension" Tab

    if (player.toggles[16] === true && player.upgrades[94] === 1 && player.transcendPoints >= (player.firstCostMythos)) {
        buyMax('first', 'Mythos', 1, 1)
    }
    if (player.toggles[17] === true && player.upgrades[95] === 1 && player.transcendPoints >= (player.secondCostMythos)) {
        buyMax('second', 'Mythos', 3, 1e2)
    }
    if (player.toggles[18] === true && player.upgrades[96] === 1 && player.transcendPoints >= (player.thirdCostMythos)) {
        buyMax('third', 'Mythos', 6, 1e4)
    }
    if (player.toggles[19] === true && player.upgrades[97] === 1 && player.transcendPoints >= (player.fourthCostMythos)) {
        buyMax('fourth', 'Mythos', 10, 1e8)
    }
    if (player.toggles[20] === true && player.upgrades[98] === 1 && player.transcendPoints >= (player.fifthCostMythos)) {
        buyMax('fifth', 'Mythos', 15, 1e16)
    }

//Autobuy "Reincarnation" Tab

    if (player.toggles[22] === true && player.reincarnationPoints >= (player.firstCostParticles)) {
        buyParticleBuilding('first', 1, true)
    }
    if (player.toggles[23] === true && player.reincarnationPoints >= (player.secondCostParticles)) {
        buyParticleBuilding('second', 1e2, true)
    }
    if (player.toggles[24] === true && player.reincarnationPoints >= (player.thirdCostParticles)) {
        buyParticleBuilding('third', 1e4, true)
    }
    if (player.toggles[25] === true && player.reincarnationPoints >= (player.fourthCostParticles)) {
        buyParticleBuilding('fourth', 1e8, true)
    }
    if (player.toggles[26] === true && player.reincarnationPoints >= (player.fifthCostParticles)) {
        buyParticleBuilding('fifth', 1e16, true)
    }

//Autobuy "ascension" tab
    if (player.researches[175] > 0) {
        for (let i = 1; i <= 10; i++) {
            if (player.ascendShards >= (getConstUpgradeMetadata(i).pop())) {
                buyConstantUpgrades(i, true);
            }
        }
    }

//Loops through all buildings which have AutoBuy turned 'on' and purchases the cheapest available building that player can afford
    if ((player.researches[190] > 0) && (player.tesseractAutoBuyerToggle == 1)) {
        const cheapestTesseractBuilding = { cost:0, intCost:0, index:0, intCostArray: [1,10,100,1000,10000] };
        for (let i = 0; i < cheapestTesseractBuilding.intCostArray.length; i++){
            if ((player.wowTesseracts >= cheapestTesseractBuilding.intCostArray[i] * Math.pow(1 + player['ascendBuilding' + (i+1)]['owned'], 3) + player.tesseractAutoBuyerAmount) && player.autoTesseracts[i+1]) {
                if ((getTesseractCost(cheapestTesseractBuilding.intCostArray[i], i+1)[1] < cheapestTesseractBuilding.cost) || (cheapestTesseractBuilding.cost == 0)){
                    cheapestTesseractBuilding.cost = getTesseractCost(cheapestTesseractBuilding.intCostArray[i], i+1)[1];
                    cheapestTesseractBuilding.intCost = cheapestTesseractBuilding.intCostArray[i];
                    cheapestTesseractBuilding.index = i+1;
                }
            }
        }
        if (cheapestTesseractBuilding.index > 0){
            buyTesseractBuilding(cheapestTesseractBuilding.intCost, cheapestTesseractBuilding.index);
        }
    }


//Generation


    if (player.upgrades[101] > 0.5) {
        player.fourthGeneratedCoin += ((player.fifthGeneratedCoin + player.fifthOwnedCoin) * (G['uFifteenMulti']) * (G['generatorPower']));
    }
    if (player.upgrades[102] > 0.5) {
        player.thirdGeneratedCoin += ((player.fourthGeneratedCoin + player.fourthOwnedCoin) * (G['uFourteenMulti']) * (G['generatorPower']));
    }
    if (player.upgrades[103] > 0.5) {
        player.secondGeneratedCoin += ((player.thirdGeneratedCoin + player.thirdOwnedCoin) * (G['generatorPower']));
    }
    if (player.upgrades[104] > 0.5) {
        player.firstGeneratedCoin += ((player.secondGeneratedCoin + player.secondOwnedCoin) * (G['generatorPower']));
    }
    if (player.upgrades[105] > 0.5) {
        player.fifthGeneratedCoin += (player.firstOwnedCoin);
    }
    let p = 1;
    p += 1 / 100 * (player.achievements[71] + player.achievements[72] + player.achievements[73] + player.achievements[74] + player.achievements[75] + player.achievements[76] + player.achievements[77])

    let a = 0;
    if (player.upgrades[106] > 0.5) {
        a += 0.10
    }
    if (player.upgrades[107] > 0.5) {
        a += 0.15
    }
    if (player.upgrades[108] > 0.5) {
        a += 0.25
    }
    if (player.upgrades[109] > 0.5) {
        a += 0.25
    }
    if (player.upgrades[110] > 0.5) {
        a += 0.25
    }
    a *= p

    let b = 0;
    if (player.upgrades[111] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[112] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[113] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[114] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[115] > 0.5) {
        b += 0.08
    }
    b *= p

    c = 0;
    if (player.upgrades[116] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[117] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[118] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[119] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[120] > 0.5) {
        c += 0.05
    }
    c *= p

    if (a !== 0) {
        player.fifthGeneratedCoin += (Math.pow(player.firstGeneratedDiamonds + player.firstOwnedDiamonds + 1, a))
    }
    if (b !== 0) {
        player.fifthGeneratedDiamonds += (Math.pow(player.firstGeneratedMythos + player.firstOwnedMythos + 1, b))
    }
    if (c !== 0) {
        player.fifthGeneratedMythos += (Math.pow(player.firstGeneratedParticles + player.firstOwnedParticles + 1, c))
    }

    if (player.runeshards > player.maxofferings) {
        player.maxofferings = player.runeshards;
    }
    if (player.researchPoints > player.maxobtainium) {
        player.maxobtainium = player.researchPoints;
    }

    G['effectiveLevelMult'] = 1;
    G['effectiveLevelMult'] *= (1 + player.researches[4] / 10 * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14]))) //Research 1x4
    G['effectiveLevelMult'] *= (1 + player.researches[21] / 100) //Research 2x6
    G['effectiveLevelMult'] *= (1 + player.researches[90] / 100) //Research 4x15
    G['effectiveLevelMult'] *= (1 + player.researches[131] / 200) //Research 6x6
    G['effectiveLevelMult'] *= (1 + player.researches[161] / 200 * 3 / 5) //Research 7x11
    G['effectiveLevelMult'] *= (1 + player.researches[176] / 200 * 2 / 5) //Research 8x1
    G['effectiveLevelMult'] *= (1 + player.researches[191] / 200 * 1 / 5) //Research 8x16
    G['effectiveLevelMult'] *= (1 + player.researches[146] / 200 * 4 / 5) //Research 6x21
    G['effectiveLevelMult'] *= (1 + 0.01 * Math.log(player.talismanShards + 1) / Math.log(4) * Math.min(1, player.constantUpgrades[9]))
    G['effectiveLevelMult'] *= G['challenge15Rewards'].runeBonus

    G['optimalOfferingTimer'] = 600 + 30 * player.researches[85] + 0.4 * G['rune5level'] + 120 * player.shopUpgrades.offeringEX;
    G['optimalObtainiumTimer'] = 3600 + 120 * player.shopUpgrades.obtainiumEX;
    autoBuyAnts()

    if (player.autoAscend) {
        if (player.autoAscendMode === "c10Completions" && player.challengecompletions[10] >= Math.max(1, player.autoAscendThreshold)) {
            reset("ascension", true)
        }
    }
    let metaData = null;
    if (player.researches[175] > 0) {
        for (let i = 1; i <= 10; i++) {
            metaData = getConstUpgradeMetadata(i)
            if (player.ascendShards >= (metaData[1].toNumber())) {
                buyConstantUpgrades(i, true);
            }
        }
    }

    const reductionValue = getReductionValue();
    if (reductionValue !== G['prevReductionValue']) {
        G['prevReductionValue'] = reductionValue;
        const resources = ["Coin", "Diamonds", "Mythos"];
        const scalings = [
            (value: number) => value,
            (value: number) => value * (value + 1) / 2,
            (value: number) => value * (value + 1) / 2
        ];
        const originalCosts = [
            [100, 2e3, 4e4, 8e5, 1.6e7],
            [1e2, 1e5, 1e15, 1e40, 1e100],
            [1, 1e2, 1e4, 1e8, 1e16],
        ];

        for (let res = 0; res < resources.length; ++res) {
            const resource = resources[res];
            for (let ord = 0; ord < 5; ++ord) {
                const num = G['ordinals'][ord];
                player[num + "Cost" + resource] = getCost(originalCosts[res][ord], player[num + "Owned" + resource] + 1, resource, scalings[res](ord + 1), reductionValue);
            }
        }

        for (let i = 0; i <= 4; i++) {
            const particleOriginalCost = [1, 1e2, 1e4, 1e8, 1e16]
            const array = ['first', 'second', 'third', 'fourth', 'fifth']
            const buyTo = player[array[i] + 'OwnedParticles'] + 1
            player[array[i] + 'CostParticles'] = Math.pow(2, buyTo - 1) * (Math.pow(1.001, Math.max(0, (buyTo - 325000)) * Math.max(0, (buyTo - 325000) + 1) / 2)) * (particleOriginalCost[i])
        }
    }
}

export const constantIntervals = (): void => {
    interval(saveSynergy, 5000);
    interval(autoUpgrades, 200);
    interval(buttoncolorchange, 200)
    interval(htmlInserts, 16)
    interval(updateAll, 100)
    interval(buildingAchievementCheck, 200)

    if (!G['timeWarp']) {
        document.getElementById("preload").style.display = "none";
        document.getElementById("offlineprogressbar").style.display = "none"
    }
}

let lastUpdate = 0;

export const createTimer = (): void => {
    lastUpdate = performance.now();
    interval(tick, 5);
}

const dt = 5;
const filterStrength = 20;
let deltaMean = 0;

const tick = () => {
    const now = performance.now();
    let delta = now - lastUpdate;
    // compute pseudo-average delta cf. https://stackoverflow.com/a/5111475/343834
    deltaMean += (delta - deltaMean) / filterStrength;
    let dtEffective;
    while (delta > 5) {
        // tack will compute dtEffective milliseconds of game time
        dtEffective = dt;
        // If the mean lag (deltaMean) is more than a whole frame (16ms), compensate by computing deltaMean - dt ms, up to 1 hour
        dtEffective += deltaMean > 16 ? Math.min(3600 * 1000, deltaMean - dt) : 0;
        // compute at max delta ms to avoid negative delta
        dtEffective = Math.min(delta, dtEffective);
        // run tack and record timings
        tack(dtEffective / 1000);
        lastUpdate += dtEffective;
        delta -= dtEffective;
    }
}

function tack(dt: number) {
    if (!G['timeWarp']) {
        dailyResetCheck();
        //Adds Resources (coins, ants, etc)
        const timeMult = calculateTimeAcceleration();
        resourceGain(dt * timeMult)
        //Adds time (in milliseconds) to all reset functions, and quarks timer.
        addTimers("prestige", dt)
        addTimers("transcension", dt)
        addTimers("reincarnation", dt)
        addTimers("ascension", dt)
        addTimers("quarks", dt)

        //Triggers automatic rune sacrifice (adds milliseconds to payload timer)
        if (player.shopUpgrades.offeringAuto > 0.5 && player.autoSacrificeToggle) {
            automaticTools("runeSacrifice", dt)
        }

        //Triggers automatic ant sacrifice (adds milliseonds to payload timers)
        if (player.achievements[173] === 1) {
            automaticTools("antSacrifice", dt);
        }

      /*Triggers automatic obtainium gain if research [2x11] is unlocked,
        Otherwise it just calculates obtainium multiplier values. */
        if (player.researches[61] === 1) {
            automaticTools("addObtainium", dt)
        }
        else {
            calculateObtainium();
        }

        //Automatically tries and buys researches lol
        if (player.autoResearchToggle && player.autoResearch <= maxRoombaResearchIndex(player)) {
                // buyResearch() probably shouldn't even be called if player.autoResearch exceeds the highest unlocked research
                let counter = 0;
                const maxCount = 1 + player.challengecompletions[14];
                while (counter < maxCount) {
                    if (player.autoResearch > 0) {
                        const linGrowth = (player.autoResearch === 200) ? 0.01 : 0;
                        if (!buyResearch(player.autoResearch, true, linGrowth)) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    counter++;
                }
            }
        }

        // Adds an offering every 2 seconds
        if (player.highestchallengecompletions[3] > 0) {
            automaticTools("addOfferings", dt/2)
        }

        // Adds an offering every 1/(cube upgrade 1x2) seconds. It shares a timer with the one above.
        if (player.cubeUpgrades[2] > 0) {
            automaticTools("addOfferings", dt * player.cubeUpgrades[2])
        }

        if (player.researches[130] > 0 || player.researches[135] > 0) {
            const talismansUnlocked = [
                player.achievements[119] > 0,
                player.achievements[126] > 0,
                player.achievements[133] > 0,
                player.achievements[140] > 0,
                player.achievements[147] > 0,
                player.antUpgrades[12-1] > 0 || player.ascensionCount > 0,
                player.shopUpgrades.shopTalisman > 0,
            ];
            let upgradedTalisman = false;

            // First, we need to enhance all of the talismans. Then, we can fortify all of the talismans.
            // If we were to do this in one loop, the players resources would be drained on individual expensive levels
            // of early talismans before buying important enhances for the later ones. This results in drastically
            // reduced overall gains when talisman resources are scarce.
            if (player.autoEnhanceToggle) {
                for (let i = 0; i < talismansUnlocked.length; ++i) {
                    if (talismansUnlocked[i]) {
                        // TODO: Remove + 1 here when talismans are fully zero-indexed
                        upgradedTalisman = buyTalismanEnhance(i + 1, true) || upgradedTalisman;
                    }
                }
            }

            if (player.autoFortifyToggle) {
                for (let i = 0; i < talismansUnlocked.length; ++i) {
                    if (talismansUnlocked[i]) {
                        // TODO: Remove + 1 here when talismans are fully zero-indexed
                        upgradedTalisman = buyTalismanLevels(i + 1, true) || upgradedTalisman;
                    }
                }
            }

            // Recalculate talisman-related upgrades and display on success
            if (upgradedTalisman) {
                updateTalismanInventory();
                calculateRuneLevels();
            }
        }

        runChallengeSweep(dt);

        //Check for automatic resets
        //Auto Prestige. === 1 indicates amount, === 2 indicates time.
        if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
            if (player.toggles[15] === true && player.achievements[43] === 1 && G['prestigePointGain'] >= (player.prestigePoints * player.prestigeamount) && player.coinsThisPrestige >= 1e16) {
                resetachievementcheck(1);
                reset("prestige", true)
            }
        }
        if (player.resettoggle1 === 2) {
            G['autoResetTimers'].prestige += dt;
            const time = Math.max(0.01, player.prestigeamount);
            if (player.toggles[15] === true && player.achievements[43] === 1 && G['autoResetTimers'].prestige >= time && player.coinsThisPrestige >= 1e16) {
                resetachievementcheck(1);
                reset("prestige", true);
            }
        }

        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            if (player.toggles[21] === true && player.upgrades[89] === 1 && G['transcendPointGain'] >= (player.transcendPoints * player.transcendamount) && player.coinsThisTranscension >= 1e100 && player.currentChallenge.transcension === 0) {
                resetachievementcheck(2);
                reset("transcension", true);
            }
        }
        if (player.resettoggle2 === 2) {
            G['autoResetTimers'].transcension += dt
            const time = Math.max(0.01, player.transcendamount);
            if (player.toggles[21] === true && player.upgrades[89] === 1 && G['autoResetTimers'].transcension >= time && player.coinsThisTranscension >= 1e100 && player.currentChallenge.transcension === 0) {
                resetachievementcheck(2);
                reset("transcension", true);
            }
        }

        if (player.currentChallenge.ascension !== 12) {
            G['autoResetTimers'].reincarnation += dt;
            if (player.resettoggle3 === 2) {
                const time = Math.max(0.01, player.reincarnationamount);
                if (player.toggles[27] === true && player.researches[46] > 0.5 && player.transcendShards >= 1e12 && G['autoResetTimers'].reincarnation >= time && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
                    resetachievementcheck(3);
                    reset("reincarnation", true);
                }
            }
            if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
                if (player.toggles[27] === true && player.researches[46] > 0.5 && G['reincarnationPointGain'] >= (player.reincarnationPoints * player.reincarnationamount) && player.transcendShards >= 1e12 && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
                    resetachievementcheck(3);
                    reset("reincarnation", true)
                }
            }
        }
        calculateOfferings("reincarnation")
    }

const loadPlugins = async () => {
    for (const obj of Object.keys(Plugins)) {
        document.getElementById(`pluginSubTab${Object.keys(Plugins).indexOf(obj) + 1}`)
            .addEventListener('click', () => Plugins[obj as keyof typeof Plugins].main())
    }
}

document.addEventListener('keydown', (event) => {
    if (document.activeElement && document.activeElement.localName === 'input') {
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
        // finally fixes the bug where hotkeys would be activated when typing in an input field
        event.stopPropagation();
        return;
    }

    let type = "";
    let num = 0;

    let cost = [null, 1, 100, 1e4, 1e8, 1e16]
    if (G['buildingSubTab'] === "coin") {
        cost = [null, 100, 2000, 4e4, 8e5, 1.6e7];
        type = "Coin"
    }
    if (G['buildingSubTab'] === "diamond") {
        cost = [null, 100, 1e5, 1e15, 1e40, 1e100];
        type = "Diamonds"
    }
    if (G['buildingSubTab'] === "mythos") {
        type = "Mythos"
    }

    const key = event.key.toUpperCase();
    switch (key) {
        case "1":
            num = 1;
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('first', cost[1]) : buyMax('first', type, num, cost[1])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(1)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 1)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 1)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(1)
                challengeDisplay(1);
            }
            break;

        case "2":
            G['buildingSubTab'] === "coin" ? num = 2 : num = 3
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('second', cost[2]) : buyMax('second', type, num, cost[2])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(2)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 2)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 2)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(2)
                challengeDisplay(2);
            }
            break;
        case "3":
            G['buildingSubTab'] === "coin" ? num = 3 : num = 6
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('third', cost[3]) : buyMax('third', type, num, cost[3])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(3)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 3)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 3)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(3)
                challengeDisplay(3);
            }
            break;
        case "4":
            G['buildingSubTab'] === "coin" ? num = 4 : num = 10
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('fourth', cost[4]) : buyMax('fourth', type, num, cost[4])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(4)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 4)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 4)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(4)
                challengeDisplay(4);
            }
            break;
        case "5":
            G['buildingSubTab'] === "coin" ? num = 5 : num = 15
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('fifth', cost[5]) : buyMax('fifth', type, num, cost[5])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(5)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 5)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 5)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(5)
                challengeDisplay(5);
            }
            break;
        case "6":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(1)
            }
            if (G['currentTab'] === "challenges" && player.reincarnationCount > 0) {
                toggleChallenges(6)
                challengeDisplay(6);
            }
            break;
        case "7":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(2)
            }
            if (G['currentTab'] === "challenges" && player.achievements[113] === 1) {
                toggleChallenges(7)
                challengeDisplay(7);
            }
            break;
        case "8":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(3)
            }
            if (G['currentTab'] === "challenges" && player.achievements[120] === 1) {
                toggleChallenges(8)
                challengeDisplay(8);
            }
            break;
        case "9":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(4)
            }
            if (G['currentTab'] === "challenges" && player.achievements[127] === 1) {
                toggleChallenges(9)
                challengeDisplay(9);
            }
            break;
        case "0":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(5)
            }
            if (G['currentTab'] === "challenges" && player.achievements[134] === 1) {
                toggleChallenges(10)
                challengeDisplay(10);
            }
            break;
        case "A":
            buyAccelerator();
            break;
        case "B":
            boostAccelerator();
            break;
        case "E":
            if (player.currentChallenge.reincarnation !== 0) {
                resetCheck('reincarnationchallenge', undefined, true)
            }
            if (player.currentChallenge.transcension !== 0) {
                resetCheck('challenge', undefined, true)
            }
            break;
        case "M":
            buyMultiplier();
            break;
        case "P":
            resetCheck('prestige');
            break;
        case "R":
            resetCheck('reincarnate');
            break;
        case "S":
            sacrificeAnts();
            break;
        case "T":
            resetCheck('transcend');
            break;
        case "ARROWLEFT":
            event.preventDefault();
            keyboardTabChange(-1);
            break;
        case "ARROWRIGHT":
            event.preventDefault();
            keyboardTabChange(1);
            break;
        case "ARROWUP":
            event.preventDefault();
            keyboardTabChange(-1, false);
            break;
        case "ARROWDOWN":
            event.preventDefault();
            keyboardTabChange(1, false);
            break;
    }

});

// whether or not this is a fresh load, or the result of an import
let loaded = false;

window.addEventListener('load', async () => {
    for (const timer of intervalHold)
        clearInt(timer);

    intervalHold.clear();

    const ver = document.getElementById('versionnumber');
    ver && (ver.textContent = `You're Testing v${player.version} - Seal of the Merchant [Last Update: 6:15PM UTC-8 08-Feb-2021]. Savefiles cannot be used in live!`);
    document.title = 'Synergism v' + player.version;

    const dec = LZString.decompressFromBase64(localStorage.getItem('Synergysave2'));
    const isLZString = dec !== '';

    if (isLZString) {
        localStorage.clear();
        localStorage.setItem('Synergysave2', btoa(dec));
        await Alert('Transferred save to new format successfully!');
    }

    if (!loaded) {
        generateEventHandlers();
        loadPlugins();
        corruptionButtonsAdd();
        corruptionLoadoutTableCreate();
    }

    loadSynergy();
    saveSynergy();
    toggleauto();
    revealStuff();
    hideStuff();
    htmlInserts();
    createTimer();
    constantIntervals();
    changeTabColor();
    loaded = true;
});