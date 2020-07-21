import * as t from '../types'

import React from 'react'

import * as v from '../views'

import {DebtsChart} from './debts-chart'
import {SpendingsChart} from './spendings-chart'

type DashboardPageProps = {}

export class DashboardPage extends v.ViewComponent<DashboardPageProps> {
  render() {

    return (
      <v.DashboardPageLayout>
        <DebtsChart />
        <SpendingsChart />
      </v.DashboardPageLayout>
    )
  }
}
