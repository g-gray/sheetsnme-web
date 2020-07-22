import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import * as u from '../utils'

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

    const payees = payeeList
      .filter((payee) => debtsByPayeeId[payee.id]?.debt)
      .sort((a, b) => a.debt - b.debt)
    const payeeTitles = payees.map((payee) => payee.title)
    const payeeDebts = payees.map((payee) => debtsByPayeeId[payee.id]?.debt)

    const options: Highcharts.Options = {
      chart: {
        type: 'bar',
      },
      title: {
        text: i18n.xln(context, i18n.PAYEE_DEBTS),
      },
      xAxis: [
        {
          categories: payeeTitles,
        },
        {
          opposite: true,
          linkedTo: 0,
          categories: payeeDebts
            .map((debt) => u.formatNumber(debt)),
        }
      ],
      yAxis: {
        title: {
          text: null,
        },
      },
      tooltip: {
        formatter: function () {
          const {x, series: {name}, point: {y, color}} = this
          return `
            <span>
              <span style="font-size: 10px;">${x}</span><br/>
              <span style="color:${color}">●</span> ${name}: <b>${u.formatNumber(y || 0)}</b><br/>
            </span>
          `
        },
      } ,
      series: [
        {
          name: i18n.xln(context, i18n.PAYEE_DEBTS),
          type: 'bar',
          showInLegend: false,
          minPointLength: 10,
          data: payeeDebts.map((debt) => {
            return {
              y: Math.abs(debt),
              color: debt < 0
                ? t.COLOR.ERROR
                : t.COLOR.PRIMARY,
            }
          }),
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
