import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import * as i18n from '../i18n'

import * as v from '../views'

type DebtsChartOwnProps = HighchartsReact.Props

type DebtsChartStateProps = {
  payeeList     : t.PayeeListRes,
  debtsByPayeeId: t.DebtsByPayeeId,
}

type DebtsChartProps = DebtsChartOwnProps & DebtsChartStateProps


class _DebtsChart extends v.ViewComponent<DebtsChartProps> {
  render() {
    const {
      context,
      props: {payeeList, debtsByPayeeId, ...restProps},
    } = this

    const categories = payeeList.map((payee) => payee.title)

    const data = payeeList.map((payee) => {
      return debtsByPayeeId[payee.id] && debtsByPayeeId[payee.id].debt
    })

    const options: Highcharts.Options = {
      chart: {
        type: 'bar',
      },
      title: {
        text: i18n.xln(context, i18n.DEBTS),
      },
      xAxis: [
        {
          categories,
        },
        {
          opposite: true,
          linkedTo: 0,
          categories,
        }
      ],
      yAxis: {
        title: {
          text: null,
        },
      },
      series: [
        {
          name: i18n.xln(context, i18n.DEBTS),
          type: 'bar',
          data,
        },
      ],
    }

    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        {...restProps}
      />
    )
  }
}

export const DebtsChart = connect<
  DebtsChartProps,
  {},
  DebtsChartOwnProps,
  t.AppState
>(state => ({
    payeeList     : state.net.payees.payeeList,
    debtsByPayeeId: state.net.payees.debtsByPayeeId,
}))(_DebtsChart)
