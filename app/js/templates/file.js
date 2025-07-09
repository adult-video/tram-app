module.exports = {
	filename: "untitled",
	filetype: "tram",
	input: "",
	settings: {
      general: {
        fontsize: 18,
        alignTextCenter: false
      },
      tram: {
        mapping: {
          A: [156, 60, 80],
          B: [150, 48, 127],
          C: [147, 48, 127],
          D: [146, 48, 100],
          E: [156, 48, 80],
          F: [155, 48, 100],
          G: [144, 60, 100],
          H: [152, 48, 80],
          I: [156, 49, 127],
          J: [149, 36, 127],
          K: [144, 48, 127],
          L: [149, 48, 127],
          M: [157, 48, 100],
          N: [158, 48, 100],
          O: [156, 54, 80],
          P: [144, 48, 100],
          Q: [145, 48, 80],
          R: [145, 60, 100],
          S: [145, 48, 127],
          T: [144, 48, 127],
          U: [156, 36, 100],
          V: [159, 48, 100],
          W: [151, 48, 127],
          X: [152, 48, 100],
          Y: [153, 48, 100],
          Z: [154, 48, 100]
        },
        properties: {
          commentIndicator: "#",
          mappingIndicator: "=",
          dataDelimiter: ":"
        }

      }
    },
	io: {},
	transport: {
		running: false,
		stopped: true,
		delay: 0
	},
	config: {
	    clock: {
		    tempo: 128,
		    source: false,
		    type: true
		  },
		  io: {
		    transport: {
		      send: true,
		      recieve: false
		    },
		    clock: {
		      send: true,
		      recieve: false
		    }
		  }
	}
}