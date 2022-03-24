from copy import copy
from pbxproj import XcodeProject

project = XcodeProject.load('Nooba.xcodeproj/project.pbxproj')

b = project.get_build_phases_by_name("PBXShellScriptBuildPhase")

for x in b:
    if (x.name == "[CP] Copy Pods Resources"):
        newList = list.copy(x.inputPaths)
        for input in x.inputPaths:
            if ".ttf" in input:
                print(input)
                newList.remove(input) 
        
        x.inputPaths = newList

        outputList = list.copy(x.outputPaths)
        for output in x.outputPaths:
            if ".ttf" in output:
                print(output)
                outputList.remove(output) 
        
        x.outputPaths = outputList

project.save()