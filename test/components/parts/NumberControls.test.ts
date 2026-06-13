import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NumberControls from '@components/parts/NumberControls.svelte';

describe('NumberControls', () => {
  it('renders 4 buttons', () => {
    render(NumberControls, { props: { integer: 50, min: 0, max: 100 } });
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('setToMax button is disabled when integer equals max', () => {
    render(NumberControls, { props: { integer: 100, min: 0, max: 100 } });
    const [maxBtn] = screen.getAllByRole('button');
    expect(maxBtn).toBeDisabled();
    expect(maxBtn).toHaveTextContent('max');
  });

  it('setToMin button is disabled when integer equals min', () => {
    render(NumberControls, { props: { integer: 0, min: 0, max: 100 } });
    const [, minBtn] = screen.getAllByRole('button');
    expect(minBtn).toBeDisabled();
    expect(minBtn).toHaveTextContent('min');
  });

  it('both action buttons enabled in normal state', () => {
    render(NumberControls, { props: { integer: 50, min: 0, max: 100 } });
    const [maxBtn, minBtn] = screen.getAllByRole('button');
    expect(maxBtn).not.toBeDisabled();
    expect(minBtn).not.toBeDisabled();
  });

  it('increment button shows "+1" when not at max', () => {
    render(NumberControls, { props: { integer: 50, min: 0, max: 100 } });
    const buttons = screen.getAllByRole('button');
    expect(buttons[2]).toHaveTextContent('+1');
  });

  it('increment button shows "min" when at max', () => {
    render(NumberControls, { props: { integer: 100, min: 0, max: 100 } });
    const buttons = screen.getAllByRole('button');
    expect(buttons[2]).toHaveTextContent('min');
  });

  it('decrement button shows "-1" when not at min', () => {
    render(NumberControls, { props: { integer: 50, min: 0, max: 100 } });
    const buttons = screen.getAllByRole('button');
    expect(buttons[3]).toHaveTextContent('-1');
  });

  it('decrement button shows "max" when at min', () => {
    render(NumberControls, { props: { integer: 0, min: 0, max: 100 } });
    const buttons = screen.getAllByRole('button');
    expect(buttons[3]).toHaveTextContent('max');
  });

  it('displays formatted max value', () => {
    render(NumberControls, { props: { integer: 50, min: 0, max: 1000000 } });
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
  });

  it('displays formatted min value', () => {
    render(NumberControls, { props: { integer: 50, min: 1000, max: 9999 } });
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });
});
