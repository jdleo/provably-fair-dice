import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Container, Icon, Label, Input, Button, Header, Form, Message, Statistic, Table, Modal, Segment} from 'semantic-ui-react';

var crypto = require('crypto');

var currentTimeHash = crypto.createHash('sha256').update(`${Date.now()}`).digest('hex');

class App extends Component {

  handleChange(event) {
    this.setState({seed: event.target.value});
  }

  updateMultiplier(event) {

    var pct = 100 / event.target.value;
    var odds = (pct - pct*0.01);

    this.setState({
      multiplier: event.target.value,
      target: ((odds / 100) * 10000)
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

      var timestamp = Date.now();
      var random = Math.random();

      //first hash seed + current time + math.random
      var resultHash = crypto.createHash('sha256').update(this.state.seed + '_' + timestamp + '_' + random).digest('hex');

      //take first 10 bits of result hash
      resultHash = resultHash.substring(0,10);

      //convert 10 hex bits to decimal
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
        });

        this.state.betHistory.push({
          result: result,
          bet: bet,
          target: this.state.target,
          winnings: `$${parseFloat((bet * this.state.multiplier)).toFixed(2)}`,
          timestamp: timestamp,
          seed: this.state.seed,
          nonce: random
        });

        //clean up array after 20 bets (to preserve memory)
        if (this.state.betHistory.length > 20) {
          this.setState({betHistory: this.state.betHistory.slice(1)});
        }
      } else {
        //loss
        this.setState({
          resultColor: "red",
          lastRoll: result,
          lastTarget: this.state.target,
          balance: balance
        });

        this.state.betHistory.push({
          result: result,
          bet: bet,
          target: this.state.target,
          winnings: `-$${parseFloat(bet).toFixed(2)}`,
          timestamp: timestamp,
          seed: this.state.seed,
          nonce: random
        });

        //clean up array after 20 bets (to preserve memory)
        if (this.state.betHistory.length > 20) {
          this.setState({betHistory: this.state.betHistory.slice(1)});
        }
      }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      balance: 1000.00,
      multiplier: 2.00,
      target: 4950,
      bet: 1,
      seed: currentTimeHash,
      errorMessage: '',
      lastRoll: '∞',
      lastTarget: '∞',
      resultColor: 'grey',
      betHistory: []
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
        <Header as='h2'>History</Header>
        {this.state.betHistory.slice(0).reverse().map(function(bet, index){
                return (
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Under Target</Table.HeaderCell>
                        <Table.HeaderCell>Roll</Table.HeaderCell>
                        <Table.HeaderCell>Winnings</Table.HeaderCell>
                        <Table.HeaderCell>Provably-fair</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    <Table.Row positive={bet.result < bet.target} negative={bet.result >= bet.target}>
                      <Table.Cell>${parseFloat(bet.bet).toFixed(2)}</Table.Cell>
                      <Table.Cell>{bet.target}</Table.Cell>
                      <Table.Cell >{bet.result}</Table.Cell>
                      <Table.Cell>{bet.winnings}</Table.Cell>
                      <Table.Cell>
                    <Modal trigger={<Button>verify</Button>} closeIcon>
                      <Header icon='heart' content='Provably-Fair Verification' />
                      <Modal.Content scrolling>
                        <Header as='h3'>Seed</Header>
                        <Segment compact inverted>{bet.seed}</Segment>
                        <Header as='h3'>Timestamp</Header>
                        <Segment compact inverted>{bet.timestamp}</Segment>
                        <Header as='h3'>Nonce</Header>
                        <Segment compact inverted>{bet.nonce}</Segment>
                        <Header as='h3'>Game seed</Header>
                        <Segment compact inverted>{bet.seed + '_' + bet.timestamp + '_' + bet.nonce}</Segment>
                        <Header as='h3'>Game hash (sha256)</Header>
                        <Segment compact inverted>{crypto.createHash('sha256').update(bet.seed + '_' + bet.timestamp + '_' + bet.nonce).digest('hex')}</Segment>
                        <Header as='h3'>Result hex (first 10 bytes of above hash)</Header>
                        <Segment compact inverted>{crypto.createHash('sha256').update(bet.seed + '_' + bet.timestamp + '_' + bet.nonce).digest('hex').substring(0,10)}</Segment>
                        <Header as='h3'>Above hex, parsed to int</Header>
                        <Segment compact inverted>{parseInt(crypto.createHash('sha256').update(bet.seed + '_' + bet.timestamp + '_' + bet.nonce).digest('hex').substring(0,10),16)}</Segment>
                        <Header as='h3'>Above int mod 10,001 (gives us random result between 0-10,000)</Header>
                        <Segment compact inverted>{parseInt(crypto.createHash('sha256').update(bet.seed + '_' + bet.timestamp + '_' + bet.nonce).digest('hex').substring(0,10),16) % 10001}</Segment>
                      </Modal.Content>
                    </Modal>
                  </Table.Cell>
                  </Table.Row>
                </Table.Body>
                </Table>
                );
              })
            }


        <br/>
        <br/><br/>
        </Container>
      </div>
    );
  }
}

export default App;
