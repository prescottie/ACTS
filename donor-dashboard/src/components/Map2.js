import React from "react";
import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
// import ProjectPin from './ProjectPin';
import mapboxgl from 'mapbox-gl';
// import ProjectInfo from './ProjectInfo';
import config from '../config';
import firebase from '../firebase';
// import '@firebase/firestore';
// import { FirestoreProvider } from 'react-firestore';

// const config = {
//   apiKey: "AIzaSyDKE67gyXHioqDq1w_vWnn-sZLzCIeYaPE",
//   authDomain: "donor-dashboard-1523321520302.firebaseapp.com",
//   databaseURL: "https://donor-dashboard-1523321520302.firebaseio.com",
//   projectId: "donor-dashboard-1523321520302",
//   storageBucket: "donor-dashboard-1523321520302.appspot.com",
//   messagingSenderId: "279127597310"
// };
// firebase.initializeApp(config);

const TOKEN = "pk.eyJ1Ijoid2luZS1tYXBzIiwiYSI6ImNqaDg4a2VjNDBoM2cyd3F4c25oMnN2MzYifQ.zHiHDDxiarb4jgK32Ya5tw"
const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const accessToken = config.get('accessToken');

class Map extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      viewport: {
        latitude: -0.390580,
        longitude: 30.181807,
        zoom: 8,
        bearing: 0,
        pitch: 0,
        width: 400,
        height: 400,
      },
      popupInfo: null,
      features: false,
      map: false,
      drawer: {
        name: '',
        id: '',
        description: '',
        completion_date: '',
        population: '',
        location : false,
        images: false,
      },
      activeImage: 0,
      touchX: 0,
      drawerStyle: {
        width: '350px',
        position: "absolute",
        top: 0,
        left: -400,
        bottom: 0,
        overflowY: 'scroll',
        marginTop: '0px',
        padding: "20px",
        backgroundColor: '#ffffff99',
        transition: 'left 0.25s ease-in',
        color: "#333",
        msTransition: 'left 0.25ss ease', 
      },
      projects: [],
      taps: {},
      sources: {},
      breakTanks: {},
      resevoirs: {},
      sedTanks: {},
    };
  }
  

  componentDidMount() {
    var db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection("projects").get().then((querySnapshot) => {
      const allData = []
      querySnapshot.forEach((doc) => {
          allData.push(doc.data());
      });
      this.setState({projects: allData})
    })
    let taps = {
      "type": "FeatureCollection",
      "features": []
    }
    let sources = {
      "type": "FeatureCollection",
      "features": []
    }
    let resevoirs = {
      "type": "FeatureCollection",
      "features": []
    }
    let breakTanks = {
      "type": "FeatureCollection",
      "features": []
    }
    let sedTanks = {
      "type": "FeatureCollection",
      "features": []
    }

    this.state.projects.forEach(proj => {
      let feature = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": proj.location,
          "properties": {name: proj.name, population: proj.population, description: proj.description, completed: proj.status}
        }
      } 

      if(proj.project_type === 'Tapstand') {
        taps.features.push(feature)
      }
      if(proj.project_type === 'Source') {
        sources.features.push(feature)
      }
      if(proj.project_type === 'Break Pressure Tank') {
        breakTanks.features.push(feature)
      }
      if(proj.project_type === 'Resevoir') {
        resevoirs.features.push(feature)
      }
      if(proj.project_type === 'Sediment Tank') {
        sedTanks.features.push(feature)
      }

    });
    setTimeout(() => {
      this.setState({taps, sources, breakTanks, resevoirs, sedTanks});

    },500)

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/scottyhagan/cjhs7y4kl8rm72smh7cmy6hgy',
      center: this.props.center,
      zoom: this.props.zoom
    });
    this.setState({map});
    map.addControl(new mapboxgl.NavigationControl())


    // const popup = new mapboxgl.Popup()
    map.on('click', function (e) {
      
      
      // var coordinates = e.features[0].geometry.coordinates.slice();
      // var name = e.features[0].properties.name;
      // const correctProject = this.props.projects.find(p => p)
        // const sources = map.querySourceFeatures('composite');
        // console.log(sources);
        const features = map.queryRenderedFeatures(e.point, {layers: ['tapstands', 'source', 'resovoir', 'break-pressure-tank', 'sediment-tank']});
        console.log(features)

        // const symbols = features.filter(feature => feature.layer.type === 'symbol');
        if(features.length && features[0].properties.id) {
          console.log(features[0])
         if(this.props.projects.length) {
          var correctProject = this.props.projects.find(proj => proj.id === features[0].properties.id);
          console.log(correctProject)
          this.updateDrawer(correctProject);
         }
        } else {
          let drawerStyle = {...this.state.drawerStyle}
          drawerStyle.left = -400;
          this.setState({drawerStyle});
        }


    }.bind(this));
    // window.addEventListener('resize', this._resize);
    this.props.fetchProjects();
    // this._resize();
  }

  componentWillReceiveProps(nextProps){

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  handleArrow = (dir) => {
		let {activeImage} = this.state;
		if(dir === "next") {
			this.setState({activeImage: activeImage + 1});
		} else {
			this.setState({activeImage: activeImage - 1})
		}
  }
  
  handleDotClick = (i) => {
		this.setState({activeImage: i});
  }
  
  handleTouchStart = (e) => {
    this.setState({touchX: e.touches[0].clientX});
  }

  handleTouchMove = (e) => {
    const {touchX} = this.state;
    const xDiff = touchX - e.touches[0].clientX;
    this.setState({xDiff});
  }
  handleTouchEnd = (e) => {
    const {xDiff} = this.state;
    const project = this.state.drawer;
    if(xDiff < -60) { // SWIPE LEFT
      if(this.state.activeImage !== 0) {
        this.setState({activeImage: this.state.activeImage - 1, xDiff: 0 })
      }
    } else if (xDiff > 60) { // SWIPE RIGHT
      if(this.state.activeImage !== project.images.length - 1) {
        this.setState({activeImage: this.state.activeImage + 1, xDiff: 0 })
      }
    }
  }

  // getGeoJson = () => {
  //   const datasetID = "cjhs7o9jq012e9iqt1txtqhvd";
  //   fetch(`https://api.mapbox.com/datasets/v1/scottyhagan/${datasetID}/features?access_token=${accessToken}`, {
  //     method: "GET",
  //   })
  //   .then(res => res.json())
  //   .then(featureCollection => {
  //     this.setState({features: featureCollection.features})
  //   });
  // }

  updateDrawer = (project) => {
    this.setState({drawer: {
      name: project.name,
      id: project.id,
      description: project.description,
      completion_date: project.completion_date,
      population: project.population,
      location : project.location,
      images: project.images,
    }});

    let drawerStyle = {...this.state.drawerStyle}
    console.log("OPENING DRAWER");
    drawerStyle.left = 0;
    this.setState({drawerStyle});
  }

  handleDrawerClose = () => {
    let drawerStyle = {...this.state.drawerStyle}
    drawerStyle.left = -400;
    this.setState({drawerStyle});
  }

  // _resize = () => {
  //   this.setState({
  //     viewport: {
  //       ...this.state.viewport,
  //       width: this.props.width || window.innerWidth,
  //       height: this.props.height || window.innerHeight
  //     }
  //   });
  // };

  // _updateViewport = (viewport) => {
  //   this.setState({viewport});
  // }


  // _renderPopup() {
  //   const {popupInfo} = this.state;

  //   return popupInfo && (
  //     <Popup tipSize={5}
  //       anchor="top"
  //       longitude={popupInfo.longitude}
  //       latitude={popupInfo.latitude}
  //       onClose={() => this.setState({popupInfo: null})} >
  //       {/* <ProjectInfo info={popupInfo} /> */}
  //     </Popup>
  //   );
  // }
  

  render() {
    const {viewport} = this.state;
    const {name, description, completion_date, images, population} = this.state.drawer;
    return (
      <div style={{position:'relative'}}>
        <div style={{height:window.innerHeight-60}} id="map"></div>
        <div id='map-drawer' style={this.state.drawerStyle}>
          <div className='drawer-close' onClick={this.handleDrawerClose}><span>&times;</span></div>
          <h1 className="drawer-heading" >{name}</h1>
          {images ? <div className="featured-project-images">
							{ this.state.activeImage !== 0 ? <svg style={{width:"40px", height:"40px"}} viewBox="0 0 24 24" className="chevron-left" onClick={()=>this.handleArrow('prev', this.state.featuredProject)}>
								<path fill="#ccc" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
							</svg> : false }
							<img className="featured-project-image" src={images[this.state.activeImage]} onTouchEnd={(e)=> this.handleTouchEnd(e)}  onTouchStart={(e)=> this.handleTouchStart(e)} onTouchMove={(e)=> this.handleTouchMove(e)}/>
							{ this.state.activeImage !== images.length - 1	? <svg style={{width:"40px",height:"40px"}} viewBox="0 0 24 24" className="chevron-right" onClick={()=>this.handleArrow('next', this.state.featuredProject)}>
								<path fill="#ccc" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
							</svg> : false }
							<div className="img-dots">
								
							{images.length > 1 ? images.map((dot,i) => {
									if(this.state.activeImage === i) {
										return <div className="active-img-dot"></div>
									} else {
										return <div className="img-dot" onClick={()=>this.handleDotClick(i)}></div>
									}
								}) : false }
							</div>
						</div> : false }
          <p className='drawer-description'>{description}</p>
          <div className='drawer-pop'>
            <strong>Population: </strong><p>{population}</p>
          </div>
          <div className='drawer-completion-date' >
            <strong>Completion Date:</strong><p>{completion_date}</p>
          </div>
        </div>
      </div>
  
    )
  }
}

export default Map;
