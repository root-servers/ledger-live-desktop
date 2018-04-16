// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import debounce from 'lodash/debounce'
import noop from 'lodash/noop'

import Box from 'components/base/Box'

const Container = styled(Box).attrs({
  horizontal: true,
  flow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 4,
  ff: 'Rubik',
  color: 'smoke',
})`
  background-color: rgba(100, 144, 241, 0.1);
  border-radius: 12px;
  display: inline-flex;
  height: 24px;
  padding: 0 3px;
`

const Btn = styled(Box).attrs({
  bg: p => (p.disabled ? 'rgba(100, 144, 241, 0.5)' : 'wallet'),
  color: 'white',
  alignItems: 'center',
  justifyContent: 'center',
})`
  border-radius: 50%;
  cursor: ${p => (p.disabled ? 'default' : 'pointer')};
  height: 18px;
  width: 18px;
`

const Num = styled(Box).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  min-width: 20px;
`

const DELAY_CLICK = 150
const DEBOUNCE_ON_CHANGE = 250

type Props = {
  max: number,
  min: number,
  onChange: Function,
  step: number,
  value: number,
}

type State = {
  value: number,
}

class StepperNumber extends PureComponent<Props, State> {
  static defaultProps = {
    max: 10,
    min: 0,
    onChange: noop,
    step: 1,
    value: 0,
  }

  state = {
    value: this.props.value,
  }

  _timeout = undefined

  isMax = (v: number) => v >= this.props.max
  isMin = (v: number) => v <= this.props.min

  emitChange = (v: number) => {
    this.setState({
      value: v,
    })
    this.debounceOnChange(v)
  }

  debounceOnChange = debounce(v => this.props.onChange(v), DEBOUNCE_ON_CHANGE)

  decrement = () => {
    const { step, min } = this.props
    const { value } = this.state

    const newValue = value - step

    if (newValue !== value) {
      const isMin = this.isMin(newValue)
      const v = isMin ? min : newValue
      this.emitChange(v)
      if (!isMin) {
        this._timeout = setTimeout(this.decrement, DELAY_CLICK)
      }
    }
  }

  increment = () => {
    const { step, max } = this.props
    const { value } = this.state

    const newValue = value + step

    if (newValue !== value) {
      const isMax = this.isMax(newValue)
      const v = isMax ? max : newValue
      this.emitChange(v)
      if (!isMax) {
        this._timeout = setTimeout(this.increment, DELAY_CLICK)
      }
    }
  }

  handleMouseUp = () => clearTimeout(this._timeout)

  render() {
    const { value } = this.state

    const isMin = this.isMin(value)
    const isMax = this.isMax(value)

    return (
      <Container>
        <Btn
          onMouseDown={!isMin ? this.decrement : undefined}
          onMouseUp={this.handleMouseUp}
          disabled={isMin}
        >
          -
        </Btn>
        <Num>{value}</Num>
        <Btn
          onMouseDown={!isMax ? this.increment : undefined}
          onMouseUp={this.handleMouseUp}
          disabled={isMax}
        >
          +
        </Btn>
      </Container>
    )
  }
}

export default StepperNumber