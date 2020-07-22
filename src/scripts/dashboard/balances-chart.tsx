import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import * as u from '../utils'

import * as i18n from '../i18n'
import * as v from '../views'

type BalancesChartOwnProps = HighchartsReact.Props

type BalancesChartStateProps = {
  accountList       : t.AccountListRes,
  balanceByAccountId: t.BalancesByAccountId,
}

type BalancesChartProps = BalancesChartOwnProps & BalancesChartStateProps

class _BalancesChart extends v.ViewComponent<BalancesChartProps> {
  render() {
    const {
      context,
      props: {accountList, balanceByAccountId, ...restProps},
    } = this

    const accounts = accountList
      .filter((account) => balanceByAccountId[account.id]?.balance)
    const accountTitles = accounts.map((account) => account.title)
    const accountBalances = accounts
      .map((account) => balanceByAccountId[account.id]?.balance)

    const options: Highcharts.Options = {
      chart: {
        type: 'bar',
      },
      title: {
        text: i18n.xln(context, i18n.ACCOUNT_BALANCES),
      },
      xAxis: [
        {
          categories: accountTitles,
        },
        {
          opposite: true,
          linkedTo: 0,
          categories: accountBalances
            .map((balance) => u.formatNumber(balance)),
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
          name: i18n.xln(context, i18n.ACCOUNT_BALANCES),
          type: 'bar',
          showInLegend: false,
          minPointLength: 10,
          data: accountBalances.map((balance) => {
            return {
              y: Math.abs(balance),
              color: balance < 0
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

export const BalancesChart = connect<
  BalancesChartProps,
  {},
  BalancesChartOwnProps,
  t.AppState
>(state => ({
    accountList       : state.net.accounts.accountList,
    balanceByAccountId: state.net.accounts.balancesByAccountId,
}))(_BalancesChart)
