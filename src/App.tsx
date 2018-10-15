import * as React from 'react';
import data from './data';
import ProntoGrid, { ISchema } from './ProntoGrid';

interface IAppState {
  rows: object[],
  schema: ISchema[]
}

const schema = [{
    key: "country",
    label: "Country"
  },{
    key: "region",
    label: "Region"
  },{
    key: "population",
    label: "Population"
  },{
    key: "area",
    label: "Area (sq. mi.)"
  },{
    key: "popDensity",
    label: "Pop. Density (per sq. mi.)"
  },{
    key: "coastAreaRatio",
    label: "Coastline (coast/area ratio)"
  },{
    key: "netMigration",
    label: "Net migration"
  },{
    key: "infantMortality",
    label: "Infant mortality (per 1000 births)"
  },{
    key: "gdp",
    label: "GDP ($ per capita)"
  },{
    key: "literacy",
    label: "Literacy (%)"
  },{
    key: "phones",
    label: "Phones (per 1000)"
  },{
    key: "arable",
    label: "Arable (%)"
  },{
    key: "crops",
    label: "Crops (%)"
  },{
    key: "other",
    label: "Other (%)"
  },{
    key: "climate",
    label: "Climate"
  },{
    key: "birthrate",
    label: "Birthrate"
  },{
    key: "deathrate",
    label: "Deathrate"
  },{
    key: "agriculture",
    label: "Agriculture"
  },{
    key: "industry",
    label: "Industry"
  },{
    key: "service",
    label: "Service"
  }
];

class App extends React.Component<any, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      schema,
      rows: data
    };
  }
  public render() {
    return (
      <ProntoGrid
        width={500}
        height={500}
        schema={this.state.schema}
        rows={this.state.rows} />
    );
  }
}

export default App;