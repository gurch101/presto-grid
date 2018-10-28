import * as React from 'react';
import data from './data';
import PrestoGrid, { Alignment, ISchemaProps } from './PrestoGrid';

interface IAppState {
  rows: object[],
  schema: ISchemaProps[],
  pendingschema: string,
  pendingrows: string
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
      rows: data,
      pendingschema: JSON.stringify(schema, null, 2),
      pendingrows: JSON.stringify(data, null, 2)
    };
  }

  public onChange = (e: any) => {
    if(e.target.name === 'schema') {
      this.setState({
        pendingschema: e.target.value
      });
    } else {
      this.setState({
        pendingrows: e.target.value
      });
    }

  }

  public applyUpdates = () => {
    /* tslint:disable no-eval */
    this.setState({
      schema: JSON.parse(this.state.pendingschema).map((column: any) => {
        if(column.valueFormatter) {
          column.valueFormatter = eval(column.valueFormatter);
        }
        return column;
      }),
      rows: JSON.parse(this.state.pendingrows)
    })
  }

  public render() {
    return (
      <div>
        <textarea
          name="schema"
          onChange={this.onChange}
          data-schema="true"
          style={{height: 200, width: 500}}
          value={this.state.pendingschema} />
        <textarea
          name="rows"
          onChange={this.onChange}
          data-rows="true"
          style={{height: 200, width: 500}}
          value={this.state.pendingrows} />
        <button
          data-apply-changes="true"
          name="submit"
          onClick={this.applyUpdates}>
          Apply Changes
        </button>
        <PrestoGrid
          width={1000}
          height={500}
          schema={this.state.schema}
          rows={this.state.rows} />
      </div>
    );
  }
}

export default App;