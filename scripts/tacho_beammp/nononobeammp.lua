local M = {}

M.onExtensionLoaded = function()
    local env = type(getfenv) == 'function' and getfenv(0);
        local core_modmanager = type(env) == 'table' and rawget(env, 'core_modmanager');
        
        local delmod = core_modmanager.deleteMod;
        local deamod = core_modmanager.deactivateMod;
        
        rawset(core_modmanager, 'deleteMod', function(name)
            local info = debug.getinfo(2, 'S')
            if info.short_src:find('MPModManager.lua') and name == "ydeltagon_tacho3" then
                print("BeamMP tried to delete mod " .. name .. " but it was blocked")
                return
            end
            return delmod(name);
        end);
        
        rawset(core_modmanager, 'deactivateMod', function(name)
            local info = debug.getinfo(2, 'S')
            if info.short_src:find('MPModManager.lua') and name == "ydeltagon_tacho3" then
                print("BeamMP tried to deactivate mod " .. name .. " but it was blocked")
            return
        end
        return deamod(name);
    end);
end

return M