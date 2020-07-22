import React from 'react'

import * as v from '../views'

import {DebtsChart} from './debts-chart'
import {SpendingsChart} from './spendings-chart'
import {BalancesChart} from './balances-chart'

type DashboardPageProps = {}

export class DashboardPage extends v.ViewComponent<DashboardPageProps> {
  render() {
    const {context: {isMobile}} = this

    if (isMobile) {
      return (
        <v.DashboardPageLayout>
          <div className='col-start-stretch gaps-v-1 padding-h-0x5'>
            <div className='bg-surface shadow-dept-1'>
              <BalancesChart />
            </div>
            <div className='bg-surface shadow-dept-1'>
              <DebtsChart />
            </div>
            <div className='bg-surface shadow-dept-1'>
              <SpendingsChart />
            </div>
          </div>
        </v.DashboardPageLayout>
      )
    }

    return (
      <v.DashboardPageLayout>
        <div className='col-start-stretch gaps-v-1'>
          <div className='row-between-start gaps-h-1'>
            <div className='flex-1 bg-surface shadow-dept-1'>
              <BalancesChart />
            </div>
            <div className='flex-1 bg-surface shadow-dept-1'>
              <DebtsChart />
            </div>
          </div>
          <div className='flex-1 bg-surface shadow-dept-1'>
            <SpendingsChart />
          </div>
        </div>
      </v.DashboardPageLayout>
    )
  }
}
