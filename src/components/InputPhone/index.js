import React from 'react'
import { Input } from 'antd'
import NumberFormat from 'react-number-format'

export default function InputPhone(props) {
  const { value, onChange } = props

  const config = {
    value,
    format: '(##) #####-####',
    mask: '_',
    customInput: Input,
    allowEmptyFormatting: true,
  }

  return (
    <NumberFormat
      {...config}
      size="large"
      style={{width: '100%'}}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
    />
  )
}
