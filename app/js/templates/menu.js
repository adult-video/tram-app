module.exports = {
  file: [
    [
      {label: "Settings",acc:"CMD+Shift+S"}
    ]
  ],
  view: [
    [
      {label: "Zoom In",acc:"CMD+NumAdd"},
      {label: "Zoom Out",acc:"CMD+NumSub"},
      { label: "Text Align", submenu: [{label: "Left"},{label: "Center"}]}
    ],
    [
      {label: "Toggle UI",acc:"CMD+."},
    ],

  ],
  edit: [],
  extras: [
    {
      label: "Transport",
      menu: [
        [
          {label: "Play Pause",acc: "Shift+Space"},
          {label: "Stop",acc: "CMD+Shift+Space"}
        ],
        [
          {label: "Tempo Up",acc: "CMD+Shift+Numadd"},
          {label: "Tempo Down",acc: "CMD+Shift+Numsub"},
          {label: "Tap Tempo",acc: "CMD+Shift+T"}
        ],
        [
          {label: "Forwards",acc: "CMD+Shift+Right"},
          {label: "Backwards", acc: "CMD+Shift+Left"}
        ]
      ]
    },
    {
      label: "IO",
      menu: [
        [
          {label: "Refresh IO",acc: "CMD+Shift+R"},
          {label: "Next Input",acc: "CMD+Shift+I"},
          {label: "Previous Input"},
          {label: "Next Output",acc: "CMD+Shift+O"},
          {label: "Previous Output"}
        ],
        [
          {label: "Toggle Clock Send"},
          {label: "Toggle Clock Recieve"},
          {label: "Clock Type",submenu: [{label: "PPQ 24"},{label: "PPQ 48"}]}
        ],
        [
          {label: "Toggle Transport Send"},
          {label: "Toggle Transport Recieve"}
        ]
      ]
    }
  ]
}