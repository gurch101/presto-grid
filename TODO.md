# TODO

- header/row border width
- borders every X rows
- border top/bottom styles
--------------------------------------
- sticky columns
--------------------------------------
- click once to convert to div with text highlighted for copy/paste
--------------------------------------
- fixed width(min/width/max) columns
--------------------------------------
- resizeable columns
--------------------------------------
- cell/header renderers
--------------------------------------

- individual cell style overrides
- cell/header renderers
- on cell/header click
- clipboard

- report ts/ts-lint bug related to context.textAlign

schema=[{
    key,
    headerLabel | headerCellRenderer,
    rowCellRenderer | rowCellValueFormatter,
    onHeaderClick,
    onCellClick
}]

rows=[{
    [key]: value
}]

// styles do not apply for cells with their own renderers
styles={
    common: {}
    header: {
        common: {},
        [key]: {}
    },
    row: {
        common: {},
        [key]: {},
        [key__headerKey]: {}
    }
}

numberOfFixedColumns
width
height
