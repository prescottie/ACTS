import React, {PureComponent} from 'react';

export default class ProjectInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.name}`;

    return (
      <div>
        <div>
          {displayName} 
        </div>
        <img width={240} src={info.image} />
      </div>
    );
  }
}