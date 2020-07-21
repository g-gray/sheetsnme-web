import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

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

    const categories = accountList.map((account) => account.title)

    const data = accountList.map((account) => {
      return balanceByAccountId[account.id]?.balance
    })
    console.info(`balanceByAccountId:`, balanceByAccountId)


    const options: Highcharts.Options = {
      chart: {
        type: 'bar',
      },
      title: {
        text: i18n.xln(context, i18n.ACCOUNT_BALANCES),
      },
      xAxis: [
        {
          categories,
        },
      ],
      yAxis: {
        title: {
          text: null,
        },
      },
      series: [
        {
          name: i18n.xln(context, i18n.ACCOUNT_BALANCES),
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

export const BalancesChart = connect<
  BalancesChartProps,
  {},
  BalancesChartOwnProps,
  t.AppState
>(state => ({
    accountList       : state.net.accounts.accountList,
    balanceByAccountId: state.net.accounts.balancesByAccountId,
}))(_BalancesChart)
