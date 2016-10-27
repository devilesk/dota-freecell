--[[require("freecell")

deck = {}
rank = {"A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"}
suit = {"C", "D", "H", "S"}
two31, state = bit32.lshift(1, 31), 0
 
function rng()
    print(state)
    state = (214013 * state + 2531011) % two31
    return bit32.rshift(state, 16)
end
 
function initdeck()
    for i, r in ipairs(rank) do
        for j, s in ipairs(suit) do
            table.insert(deck, r .. s)
        end
    end
end
 
function deal(num)
    initdeck()
    state = num
    print("Game #" .. num)
    repeat
        choice = rng() % #deck + 1
        deck[choice], deck[#deck] = deck[#deck], deck[choice]
        --print(" " .. deck[#deck])
        if (#deck % 8 == 5) then
            print()
        end
        deck[#deck] = nil
    until #deck == 0
    print()
end]]

-- Generated from template

if GameMode == nil then
	GameMode = class({})
end

function Precache( context )
	--[[
		Precache things we know we'll use.  Possible file types include (but not limited to):
			PrecacheResource( "model", "*.vmdl", context )
			PrecacheResource( "soundfile", "*.vsndevts", context )
			PrecacheResource( "particle", "*.vpcf", context )
			PrecacheResource( "particle_folder", "particles/folder", context )
	]]
  PrecacheResource("soundfile", "soundevents/custom_sounds.vsndevts", context)
end

function GameMode:OnNPCSpawned(event)
  local npc = EntIndexToHScript(event.entindex)
  if npc:IsRealHero() then
    npc:RemoveSelf()
  end
end

function GameMode:OnGameRulesStateChange()
	local nNewState = GameRules:State_Get()
 print("OnGameRulesStateChange", nNewState)
	if nNewState == DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then
    print("DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP")
    GameRules:SetCustomGameSetupTimeout(0)
    PlayerResource:SetCustomTeamAssignment( 0, DOTA_TEAM_GOODGUYS )
    GameRules:LockCustomGameSetupTeamAssignment(true)
    GameRules:FinishCustomGameSetup()
	end
end

-- Create the game mode when we activate
function Activate()
	GameRules.AddonTemplate = GameMode()
	GameRules.AddonTemplate:InitGameMode()
end

function GameMode:InitGameMode()
	print( "Template addon is loaded." )
  ListenToGameEvent('npc_spawned', Dynamic_Wrap(GameMode, 'OnNPCSpawned'), self)
  ListenToGameEvent('game_rules_state_change', Dynamic_Wrap(GameMode, 'OnGameRulesStateChange'), self)
--freecell = FREECELL()
--deal(1)
--deal(617)
	GameRules:GetGameModeEntity():SetThink( "OnThink", self, "GlobalThink", 2 )
end

-- Evaluate the state of the game
function GameMode:OnThink()
	if GameRules:State_Get() == DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
		--print( "Template addon script is running." )
    GameRules:SetTimeOfDay(.5)
	elseif GameRules:State_Get() >= DOTA_GAMERULES_STATE_POST_GAME then
		return nil
	end
	return 1
end