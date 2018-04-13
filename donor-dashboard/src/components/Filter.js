import React from 'react'

class Filter extends React.Component {
  
  render() {
    return(
      <div className="Filter">
        <div className="filter-header">
          <h2>ACTS - Projects 💧</h2>
        </div>
        <div className="filter-section">
          <h4 className="filter-section-heading">Type</h4>
          <div className="filter-checkbox">
            <input type="checkbox" checked/>
            <label>Tapstand <span className="filter-count">(420)</span></label>
          </div>
          <div className="filter-checkbox">
            <input type="checkbox" checked />
            <label>Resevoir</label>
          </div>
          <div className="filter-checkbox">
            <input type="checkbox" checked />
            <label>Source</label>
          </div>
          <div className="filter-checkbox">
            <input type="checkbox" checked />
            <label>Break Pressure Tank</label>
          </div>
          <div className="filter-checkbox">
            <input type="checkbox"  checked/>
            <label>Sediment Tank</label>
          </div>
        </div>
        <div className="filter-section">
          <h4 className="filter-section-heading">Status</h4>
          <div className="filter-checkbox">
            <input type="checkbox"/>
            <label>Current</label>
          </div>
          <div className="filter-checkbox">
            <input type="checkbox"/>
            <label>Completed</label>
          </div>
        </div>
        <div className="filter-section">
          <h4 className="filter-section-heading">Status</h4>
          <div className="filter-checkbox">
            <input type="checkbox"/>
            <label>Current</label>
          </div>
          <div className="filter-checkbox">
            <input type="checkbox"/>
            <label>Completed</label>
          </div>
        </div>
      </div>
    );
  }
}
export default Filter;