import React, { Component } from 'react';
import { Collapse, CardBody, Card, CardHeader,Button } from 'reactstrap';

class App extends Component {
  constructor() {
      super();
      this.state = { collapse: 0, repos: [],favorites:[] };
      
    }

    toggle = (e) => {
      let event = e.target.dataset.event;
      this.setState({ collapse: this.state.collapse === Number(event) ? 0 : Number(event) });
    }

    favorite = (repoId) =>{
      this.setState({favorites:[...this.state.favorites,repoId]})
      localStorage.setItem("favorites",this.state.favorites)
    }

    unFavorite = (repoId) =>{
      let favorites = this.state.favorites;
      this.setState({favorites:[...favorites.filter(id => id !== repoId)]})
      localStorage.setItem("favorites",this.state.favorites)
    }

    checkFavorite = (id) => {
      if(this.state.favorites.includes(id)){
        return <Button onClick={(e) => this.unFavorite(id)} color="danger">unfavorite</Button>
      }
      return <Button onClick={(e) => this.favorite(id)} color="success">favorite</Button>
    }

    componentWillMount() {
    fetch('https://api.github.com/search/repositories?q=topic:react&per_page=10', {
      method: 'GET'
    }).then(res => res.json())
      .then((result) => {
        this.setState({
          repos: result.items
        })
      },
        (error) => {
          console.log(error);
        }); 
        
        if (localStorage.getItem("favorites") !== null) {
          console.log(localStorage.getItem("favorites"))
          this.setState({favorites:localStorage.getItem("favorites")})
        }

  }


    render() {
      const {repos, collapse} = this.state;
      return (
        <div className="container">
            <h3 className="page-header">Github repos</h3>
            {repos.map((item,index) => {
              return (
                <Card style={{ marginBottom: '1rem' }} key={index}>
                  <CardHeader onClick={this.toggle} data-event={index}>{`${item.name} by ${item.owner.login}`}</CardHeader>
                  <Collapse isOpen={collapse === index}>
                  <CardBody>
                    <p>ID: {item.id}</p>
                  <p>Forks: {item.forks}</p>
                  <p>Stars: {item.stargazers_count}</p>
                  <p>{item.description}</p>
                  <a href={item.html_url} target="_blank">repo link</a>
                  <br></br>
                  <br></br>
                  {this.checkFavorite(item.id)}
                  
                  </CardBody>
                  </Collapse>
                </Card>
              )
            })}     
            
          </div>
      );
    }
}

export default App;
