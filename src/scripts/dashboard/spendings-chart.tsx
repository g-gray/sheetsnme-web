import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import * as i18n from '../i18n'

import * as v from '../views'

type SpendingsChartOwnProps = HighchartsReact.Props

type SpendingsChartStateProps = {
  categoryList         : t.CategoryListRes,
  spendingsByCategoryId: t.SpendingsByCategoryId,
}

type SpendingsChartProps = SpendingsChartOwnProps & SpendingsChartStateProps

class _SpendingsChart extends v.ViewComponent<SpendingsChartProps> {
  render() {
    const {
      context,
      props: {categoryList, spendingsByCategoryId, ...restProps},
    } = this

    const categories = categoryList.map((category) => category.title)

    const data = categoryList.map((category) => {
      return spendingsByCategoryId[category.id]?.spending
    })

    const options: Highcharts.Options = {
      chart: {
        type: 'bar',
      },
      title: {
        text: i18n.xln(context, i18n.CATEGORY_SPENDINGS),
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
          name: i18n.xln(context, i18n.CATEGORY_SPENDINGS),
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

export const SpendingsChart = connect<
  SpendingsChartProps,
  {},
  SpendingsChartOwnProps,
  t.AppState
>(state => ({
    categoryList         : state.net.categories.categoryList,
    spendingsByCategoryId: state.net.categories.spendingsByCategoryId,
}))(_SpendingsChart)
