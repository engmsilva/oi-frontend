import React from 'react'
import "moment/locale/pt-br";
import { DatePicker } from 'antd'
import ptBR from "antd/es/date-picker/locale/pt_BR";
import moment from 'moment'

const dateFormat = 'DD/MM/YYYY'

export default function InputDate(props) {
  const { value, onChange } = props

  return (
    <DatePicker
      locale={ptBR}
      value={value && moment(value, dateFormat)}
      style={{ width: '100%' }}
      format={dateFormat}
      onChange={(date, dateString) => {
        onChange(dateString)
      }}
      size="large"
    />
  )
}
