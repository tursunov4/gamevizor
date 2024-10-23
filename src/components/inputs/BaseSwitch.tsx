import { Component } from "react";
import Switch from "react-switch";

interface BaseSwitchProps {
  checked?: boolean;
  onValueChange?: (value: boolean) => void;
}

interface BaseSwitchState {
  checked: boolean;
}

class BaseSwitch extends Component<BaseSwitchProps, BaseSwitchState> {
  constructor(props: any) {
    super(props);
    this.state = { checked: props.checked || false };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps: BaseSwitchProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({ checked: this.props.checked || false });
    }
  }

  handleChange(checked: boolean) {
    this.setState({ checked }, () => {
      if (this.props.onValueChange) {
        this.props.onValueChange(checked);
      }
    });
  }

  render() {
    return (
      <Switch onChange={this.handleChange} checked={this.state.checked} onColor="#FF007A"
      offColor="#5C586B" uncheckedIcon={false} checkedIcon={false} width={35} height={17}/>
    );
  }
}

export default BaseSwitch;