import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import * as u from '../utils'

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

    const categories = categoryList
      .filter((category) => spendingsByCategoryId[category.id]?.spending)
    const categoryTitles = categories.map((category) => category.title)
    const categorySpendings = categories
      .map((category) => spendingsByCategoryId[category.id]?.spending)

    const options: Highcharts.Options = {
      chart: {
        type: 'bar',
      },
      title: {
        text: i18n.xln(context, i18n.CATEGORY_SPENDINGS),
      },
      xAxis: [
        {
          categories: categoryTitles,
        },
        {
          opposite: true,
          linkedTo: 0,
          categories: categorySpendings
            .map((category) => u.formatNumber(category)),
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
          name: i18n.xln(context, i18n.CATEGORY_SPENDINGS),
          type: 'bar',
          showInLegend: false,
          minPointLength: 10,
          data: categorySpendings.map((spending) => {
            return {
              y: Math.abs(spending),
              color: t.COLORS.PRIMARY,
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

export const SpendingsChart = connect<
  SpendingsChartProps,
  {},
  SpendingsChartOwnProps,
  t.AppState
>(state => ({
    categoryList         : state.net.categories.categoryList,
    spendingsByCategoryId: state.net.categories.spendingsByCategoryId,
}))(_SpendingsChart)
