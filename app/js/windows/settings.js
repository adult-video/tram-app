import {GUIWrapper} from "../submodules/av/js/frontend/guiWrapper.js"
import {TRAM} from "../submodules/tram/js/tram.js"
import {FSWrapper} from "../submodules/av/js/frontend/fsWrapper.js"

const IPC = require("electron").ipcRenderer

const LATIN_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

window.addEventListener("DOMContentLoaded",function(){
  let SET_FUNC = null
  let GUI
  let FILE
  let FS = new FSWrapper(function(){
    FILE = FS.get()
    init()
  })

  let actions = {
    increasefontsize: function(){
      let v = FILE.settings.general.fontsize
      v++
      FILE.settings.general.fontsize = Math.min(48,v)
      update()
      save()
    },
    decreasefontsize: function(){
      let v = FILE.settings.general.fontsize
      v--
      FILE.settings.general.fontsize = Math.max(8,v)
      update()
      save()
    },
    togglegeneralaligntextcenter: function(){
      FILE.settings.general.alignTextCenter = !FILE.settings.general.alignTextCenter
      update()
      save()
    },
  	selectsectiongeneral: function(){
  		document.getElementById("settings").classList = "sectionGeneral-active"
  	}.bind(this),
  	selectsectiontram: function(){
  		document.getElementById("settings").classList = "sectionTram-active"
  	}.bind(this),
    setcharacter: function(e,target){
      if(SET_FUNC){
        document.removeEventListener("keydown",SET_FUNC)
        update()
      }
      e.target.innerText = "Press any key"
      let char = LATIN_ALPHABET.indexOf(e.target.getAttribute("data-char"))
      SET_FUNC = function(char,target,e){
        if(GUIWrapper.isValidCharacterKeyCode(e.keyCode)){
          let key = e.key.toUpperCase()
          if(
            !(FILE.settings.general.occupiedCharacters.includes(key) ||
            (targetOverwrite && FILE.settings.tram.mapping[key]))
          ){
            let v = GUIWrapper.getValueFromKeystring(target,FILE)
            FILE.settings.general.occupiedCharacters = FILE.settings.general.occupiedCharacters.replace(v,key)
            GUIWrapper.setValueFromKeystring(target,key,FILE)
            document.removeEventListener("keydown",SET_FUNC)
            SET_FUNC = null
            update()
            save()
          }
        }
      }.bind(this,char,target)
      document.addEventListener("keydown",SET_FUNC)
    },
    settramcommentindicator: function(e){
      actions.setcharacter(e,"settings.tram.properties.commentIndicator")
    },
    settrammappingindicator: function(e){
      actions.setcharacter(e,"settings.tram.properties.mappingIndicator")
    },
    settramdatadelimiter: function(e){
      actions.setcharacter(e,"settings.tram.properties.dataDelimiter")
    },
    addtrammapping: function(e){
      if(SET_FUNC){
        document.removeEventListener("keydown",SET_FUNC)
        update()
      }
      e.target.innerText = "Press any key"
      SET_FUNC = function(e){
        if(GUIWrapper.isValidCharacterKeyCode(e.keyCode)){
          let key = e.key.toUpperCase()
          if(
            !FILE.settings.tram.mapping[key] &&
            FILE.settings.tram.properties.commentIndicator != key &&
            FILE.settings.tram.properties.mappingIndicator != key &&
            FILE.settings.tram.properties.dataDelimiter != key
          ){
            FILE.settings.tram.mapping[key] = TRAM.DEFAULT_MAPPING
            document.removeEventListener("keydown",SET_FUNC)
            SET_FUNC = null
            update()
            save()
          }
        }
      }
      document.addEventListener("keydown",SET_FUNC)
    }
  }
  let displays = {
    generalFontsize: "settings.general.fontsize",
    generalAlignTextCenter: "settings.general.alignTextCenter",
    tramCommentIndicator: "settings.tram.properties.commentIndicator",
    tramMappingIndicator: "settings.tram.properties.mappingIndicator",
    tramDataDelimiter: "settings.tram.properties.dataDelimiter",
    addTramMapping: "+"
  }

  function init(){
    GUI = new GUIWrapper(actions,displays)
    update()
  }
  
  function update(){
    GUI.update(FILE)
    const table = document.getElementById("tramMapping")
    table.innerHTML = "<tr><td>Char</td><td>Channel</td><td>Note</td><td>Octave</td><td>Velocity</td>"
    for(let m in FILE.settings.tram.mapping){
      let mapping = FILE.settings.tram.mapping[m]
      let tr = document.createElement("tr")

      let th = document.createElement("th")
      th.innerText = m
      th.addEventListener("click",function(e){
        delete FILE.settings.tram.mapping[m]
        update()
        save()
      }.bind(false,m))
      th.addEventListener("mouseover",function(e){
        th.innerText = "-"
      })
      th.addEventListener("mouseleave",function(e){
        th.innerText = m
      }.bind(false,m))
      
      let tdC = document.createElement("td") //channel
      let tdN = document.createElement("td") //note
      let tdO = document.createElement("td") //note
      let tdV = document.createElement("td") //velocity

      let C = TRAM.data0ToChannel(mapping[0])
      let N = TRAM.data1ToNoteAndOctave(mapping[1])
      let V = TRAM.data2ToVelocity(mapping[2])

      let sC = document.createElement("select")
      sC.addEventListener("change",function(){
        let v = sC.options[sC.selectedIndex].value
        FILE.settings.tram.mapping[m][0] = TRAM.channelToData0(v)
        save()
      })
      for(let c = 1; c <= 16; c++){
        let o = document.createElement("option")
        o.value = c
        o.innerText = c
        if(c == C){
          o.selected = true
        }
        sC.appendChild(o)
      }
      tdC.appendChild(sC)

      let sN = document.createElement("select")
      sN.addEventListener("change",function(){
        let v = sN.options[sN.selectedIndex].value
        let o = Math.floor(FILE.settings.tram.mapping[m][1] / 12)
        let n = TRAM.noteToIndex(v)
        FILE.settings.tram.mapping[m][1] = o*12 + n
        save()
      })
      for(let n of TRAM.NOTES){
        let o = document.createElement("option")
        o.value = n
        o.innerText = n
        if(n == N[0]){
          o.selected = true
        }
        sN.appendChild(o)
      }
      tdN.appendChild(sN)

      let sO = document.createElement("select")
      sO.addEventListener("change",function(){
        let v = sO.options[sO.selectedIndex].value
        let o = v
        let n = FILE.settings.tram.mapping[m][1] % 12
        FILE.settings.tram.mapping[m][1] = o*12 + n
        save()
      })
      for(let c = 0; c < 10; c++){
        let o = document.createElement("option")
        o.value = c
        o.innerText = c
        if(c == N[1]){
          o.selected = true
        }
        sO.appendChild(o)
      }
      tdO.appendChild(sO)

      let sV = document.createElement("select")
      sV.addEventListener("change",function(){
        let v = sV.options[sV.selectedIndex].value
        FILE.settings.tram.mapping[m][2] = TRAM.velocityToData2(v)
        save()
      })
      for(let v of TRAM.VELOCITYS){
        let o = document.createElement("option")
        o.value = v
        o.innerText = v
        if(v == V){
          o.selected = true
        }
        sV.appendChild(o)
      }
      tdV.appendChild(sV)

      tr.appendChild(th)
      tr.appendChild(tdC)
      tr.appendChild(tdN)
      tr.appendChild(tdO)
      tr.appendChild(tdV)
      table.appendChild(tr)
    }
  }

  function save(){
    FS.save(FILE,function(){
      IPC.send("refresh","settings")
    })
  }

  function refresh() {
    FS.update(() => {
      FILE = FS.get()
      update()
    })
  }

  IPC.on("refresh", (event,sender) => {
    refresh()
  })
})

