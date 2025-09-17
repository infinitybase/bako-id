import { Input, type InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { createNumberMask } from 'text-mask-addons';
import MaskedInput from 'react-text-mask';

interface CurrencyInputProps extends InputProps {
  decimalLimit?: number;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ decimalLimit = 9, ...props }, ref) => {
    const currencyMask = createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ',',
      allowDecimal: true,
      decimalSymbol: '.',
      decimalLimit,
      allowNegative: false,
      allowLeadingZeroes: false,
    });

    const handleCommaToDot = (
      event: React.ChangeEvent<HTMLInputElement>,
      inputValue: string
    ) => {
      const nativeEvent = event.nativeEvent as InputEvent;
      const isComma = nativeEvent.data === ',';

      if (isComma && !inputValue.endsWith('.')) {
        const caretPosition = event.target.selectionStart ?? 0;
        const isFirstChar = inputValue.length === 0;
        const complement = isFirstChar ? '0.' : '.';

        const newValue = isFirstChar
          ? complement
          : inputValue.slice(0, caretPosition) +
            complement +
            inputValue.slice(caretPosition);

        event.target.value = newValue;

        const newCaretPosition = caretPosition + (isFirstChar ? 2 : 1);
        setTimeout(() => {
          event.target.setSelectionRange(newCaretPosition, newCaretPosition);
        }, 0);

        return true; // Indica que houve modificação
      }
      return false; // Indica que não houve modificação
    };

    const handleLeadingZero = (
      event: React.ChangeEvent<HTMLInputElement>,
      inputValue: string,
      isBackspace: boolean
    ) => {
      if (inputValue.startsWith('0') && inputValue.length <= 1) {
        event.target.value = isBackspace ? '' : '0.';
        return true; // with modification
      }
      return false; // without modification
    };

    const removeInvalidCharacters = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      event.target.value = event.target.value.replace(/[^0-9.,]/g, '');
    };

    const handleCurrencyChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const inputValue = event.target.value;
      const currentValue = props.value ?? '';
      const isBackspace = inputValue.length < (currentValue as string)?.length;

      // replace comma with dot
      if (handleCommaToDot(event, inputValue)) {
        props.onChange?.(event);
        return;
      }

      // Handle leading zero
      if (handleLeadingZero(event, inputValue, isBackspace)) {
        props.onChange?.(event);
        return;
      }

      // Remove invalid characters
      removeInvalidCharacters(event);

      props.onChange?.(event);
    };

    return (
      <MaskedInput
        key={decimalLimit}
        mask={currencyMask}
        value={props.value}
        onChange={handleCurrencyChange}
        onBlur={props.onBlur}
        maxLength={decimalLimit + 2}
        render={(maskedRef, inputProps) => (
          <Input
            {...props}
            {...inputProps}
            inputMode="decimal"
            step="any"
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              maskedRef(node!);
            }}
            _focus={{ boxShadow: 'none', outline: 'none' }}
            _focusVisible={{
              boxShadow: 'none',
              outline: 'none',
            }}
            outline="none"
          />
        )}
      />
    );
  }
);
