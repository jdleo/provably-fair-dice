import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Container, Icon, Label, Input, Button, Header, Form, Message, Statistic} from 'semantic-ui-react';

var crypto = require('crypto');

var currentTimeHash = crypto.createHash('sha256').update(`${Date.now()}`).digest('hex');

class App extends Component {

  handleChange(event) {
    this.setState({seed: event.target.value});
  }

  updateMultiplier(event) {

    var pct = 100 / event.target.value;
    var odds = (pct - 0.55).toFixed(2);

    this.setState({
      multiplier: event.target.value,
      target: ((odds / 100) * 10000).toFixed(0)
    });
  }

  updateBet(event) {
    this.setState({bet: event.target.value});
  }

  randomizeSeed() {
    this.setState({seed: crypto.createHash('sha256').update(`${Date.now()}`).digest('hex')});
  }

  handleBet() {
    //clear error state
    this.setState({errorMessage: ''});

    //first, check if bet is less than zero
    if (this.state.bet < 0) {
      this.setState({errorMessage: "bet can't be less than zero"})
    } else if (isNaN(this.state.bet)) {
      this.setState({errorMessage: "bet is not a number"})
    } else if (this.state.balance - this.state.bet < 0) {
      this.setState({errorMessage: "insufficient balance!"})
    } else {
      //good to bet now

      //first deduct bet from balance
      var bet = this.state.bet;
      var balance = this.state.balance - bet;

      //first hash seed + current time + math.random
      var resultHash = crypto.createHash('sha256').update(this.state.seed + '_' + Date.now() + '_' + Math.random()).digest('hex');

      //take first 8 bits of result hash
      resultHash = resultHash.substring(0,8);

      //convert 8 hex bits to decimal
      var result = parseInt(resultHash, 16);

      //take decimal mod 10,001
      result = result % 10001;

      if (result < this.state.target) {
        //win
        this.setState({
          resultColor: "green",
          lastRoll: result,
          lastTarget: this.state.target,
          balance: balance + (bet * this.state.multiplier)
        })
      } else {
        //loss
        this.setState({
          resultColor: "red",
          lastRoll: result,
          lastTarget: this.state.target,
          balance: balance
        })
      }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      balance: 1000.00,
      multiplier: 2.00,
      target: 4945,
      bet: 1,
      seed: currentTimeHash,
      errorMessage: '',
      lastRoll: '∞',
      lastTarget: '∞',
      resultColor: 'grey'
    };

    this.handleChange = this.handleChange.bind(this);
    this.randomizeSeed = this.randomizeSeed.bind(this);
    this.updateMultiplier = this.updateMultiplier.bind(this);
    this.updateBet = this.updateBet.bind(this);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" style={{"height":"200px"}}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Casino</h1>
        </header>
        <Container style={{'marginTop':'40px'}}>
          <Label as='a' size='massive'>
            <Icon name='dollar' />
            {this.state.balance.toFixed(2)}
          </Label>
          <br/>
          <Header as='h2'>Seed</Header>
          <Input
            action={
              <Button
                color='teal'
                icon='random'
                content='randomize seed'
                onClick={this.randomizeSeed}
              />
            }
            value={this.state.seed}
            onChange={this.handleChange}
            placeholder='seed'
            style={{'marginTop':'10px'}}
            fluid
          />

          <Statistic color={this.state.resultColor}>
            <Statistic.Value>{this.state.lastRoll}</Statistic.Value>
            <Statistic.Label>target: less than {this.state.lastTarget}</Statistic.Label>
          </Statistic>

          <Header as='h2'>Bet</Header>
          <Input
            value={this.state.bet}
            onChange={this.updateBet}
            icon='dollar'
            iconPosition='left'
            placeholder='your bet'
          />
          <br/>
          <br/>
        <Form>
          <Form.Field inline>
            <Input
              value={this.state.multiplier}
              onChange={this.updateMultiplier}
              label='x'
              labelPosition='left'
              placeholder='multiplier' />
            <Label pointing='left' size='large'>{(this.state.target / 100)} %</Label>
          </Form.Field>
        </Form>

        {this.state.errorMessage
          && <Message negative>
                <Message.Header>Error</Message.Header>
                <p>{this.state.errorMessage}</p>
             </Message>
        }
        <br/>
        <br/><br/>
        <Button
          onClick={() => this.setState({bet: this.state.bet * 2})}
          size='large'
          color='green'
        >
          Double
        </Button>
        <Button
          onClick={() => this.setState({bet: this.state.bet / 2})}
          size='large'
          color='red'
        >
          Halve
        </Button>
        <br/>
        <br/><br/>
        <Button
          onClick={() => this.handleBet()}
          size='massive'
          color='teal'
        >
          BET
        </Button>
        <br/>
        <br/><br/>
        <br/>
        <br/><br/>
        </Container>
      </div>
    );
  }
}

export default App;
