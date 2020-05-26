import * as t from '../types'

import React from 'react'
import {connect} from 'react-redux'

// @ts-ignore
import * as fpx from 'fpx'

import * as e from '../env'
import * as u from '../utils'

import * as a from '../actions'

import * as i18n from '../i18n'

import * as m from '../views/misc'
import * as s from '../views/svg'
import * as f from '../views/forms'

import * as p from '../views/pages'
import * as v from '../views'

/**
 * CategoryPage
 */

type CategoryPageProps = {}


export class CategoriesPage extends m.ViewComponent<CategoryPageProps> {
  openCategoryFormDialog = () => {
    const {context} = this

    e.dispatch(a.addDialog<p.FormDialogProps<CategoryFormOwnProps>>(
      p.FormDialog,
      {
        title: i18n.xln(context, i18n.NEW_CATEGORY),
        form: CategoryForm,
      }
    ))
  }

  render() {
    const {openCategoryFormDialog} = this

    return (
      <v.ListPage action={<v.Fab onClick={openCategoryFormDialog} />}>
        <CategoriesList />
      </v.ListPage>
    )
  }
}



/**
 * CategoryForm
 */

type CategoryFormOwnProps = p.FormProps<{
  category?: t.CategoryReq,
}>

type CategoryFormStateProps = {
  pending: boolean,
}

type CategoryFormProps = CategoryFormOwnProps & CategoryFormStateProps

type CategoryFormState = {
  formValues: t.CategoryReq,
  errors    : undefined | t.ValidationError[],
}


class _CategoryForm extends m.ViewComponent<CategoryFormProps, CategoryFormState> {
  readonly state = {
    formValues: this.props.category || {title: ''},
    errors: undefined,
  }

  fetchCategories = () => {
    const {context} = this
    return e.dispatch(a.fetchCategories(i18n.xln(context, i18n.FETCHING_CATEGORIES)))
  }

  onSubmit = (event: t.RFormEvent) => {
    u.preventDefault(event)

    const {
      context,
      props: {onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    const promise = formValues.id
      ? e.dispatch(a.updateCategory(
        formValues.id,
        formValues,
        i18n.xln(context, i18n.UPDATING_CATEGORY)
      ))
      : e.dispatch(a.createCategory(
        formValues,
        i18n.xln(context, i18n.CREATING_CATEGORY)
      ))

    promise
      .catch((errors: t.FetchError) => {
        this.setState({errors})
        throw errors
      })
      .then(() => onSubmitSuccess())
      .then(() => e.dispatch(a.addNotification(formValues.id
        ? i18n.xln(context, i18n.CATEGORY_UPDATED)
        : i18n.xln(context, i18n.CATEGORY_CREATED)
      )))
      .then(this.fetchCategories)
  }

  onDelete = (event: v.FakeButtonEvent) => {
    u.preventDefault(event)

    const {
      context,
      props: {onSubmitSuccess},
      state: {formValues},
    } = this

    this.setState({errors: undefined})

    e.dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_CATEGORY),
      onConfirm: () => {
        e.dispatch(a.deleteCategory(
          formValues.id!,
          i18n.xln(context, i18n.DELETING_CATEGORY)
        ))
          .then(() => onSubmitSuccess())
          .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.CATEGORY_DELETED))))
          .then(this.fetchCategories)
      },
    }))
  }

  render() {
    const {
      context, context: {isMobile},
      state: {errors, formValues: {id}},
      props: {pending},
      onSubmit, onDelete,
    } = this

    return (
      <form className='col-start-stretch' onSubmit={onSubmit}>
        <div
          className={`col-start-stretch
                      ${isMobile ? 'padding-v-1 padding-h-1x25' : 'padding-v-1x25'}`}
        >
          <f.FormTextElement
            name='title'
            label={i18n.xln(context, i18n.TITLE)}
            disabled={pending}
            {...u.bindValue(this, ['formValues', 'title'])}
          />
        </div>
        <hr className='hr margin-h-1x25' />
        <div className='row-between-stretch padding-v-1 padding-h-1x25'>
          <div className='flex-1 row-start-stretch'>
            {!id ? null :
            <v.FakeButton
              className='btn-transparent'
              onClick={onDelete}
              disabled={pending}
            >
              {i18n.xln(context, i18n.DELETE)}
            </v.FakeButton>}
          </div>
          <button
            type='submit'
            className={`btn-primary ${isMobile ? '' : 'btn-wide'}`}
            disabled={pending}>
            {i18n.xln(context, i18n.SUBMIT)}
          </button>
          <div className='flex-1' />
        </div>
        {!errors ? null :
        <hr className='hr margin-h-1x25' />}
        <f.FormErrors errors={errors} />
      </form>
    )
  }
}

const CategoryForm = connect<CategoryFormStateProps, {}, CategoryFormOwnProps, t.AppState>(state => ({
  pending: !fpx.isEmpty(state.net.pending),
}))(_CategoryForm)



/**
 * CategoryList
 */

type CategoriesListStateProps = {
  categories: t.CategoryListRes,
  pending   : boolean,
}

type CategoriesListProps = CategoriesListStateProps


class _CategoriesList extends m.ViewComponent<CategoriesListProps> {
  onOpen = (category: t.CategoryRes) => (): void => {
    const {context} = this

    e.dispatch(a.addDialog<p.FormDialogProps<CategoryFormOwnProps>>(
      p.FormDialog,
      {
        title: i18n.xln(context, i18n.EDIT_CATEGORY),
        form: CategoryForm,
        formProps: {category},
      }
    ))
  }

  onDelete = (category: t.CategoryRes) => (): void => {
    const {context} = this

    e.dispatch(a.addDialog(p.ConfirmDialog, {
      question: i18n.xln(context, i18n.DELETE_CATEGORY),
      onConfirm: () => {
        e.dispatch(a.deleteCategory(
          category.id,
          i18n.xln(context, i18n.DELETING_CATEGORY)
        ))
          .then(() => e.dispatch(a.addNotification(i18n.xln(context, i18n.CATEGORY_DELETED))))
          .then(() => e.dispatch(a.fetchCategories(i18n.xln(context, i18n.FETCHING_CATEGORIES))))
      },
    }))
  }

  render() {
    const {
      props: {categories, pending},
      onOpen, onDelete,
    } = this

    return (
      <v.EntityItemList
        entityList={categories}
        pending={pending}
      >
        {categories.map(category => (
          <v.EntityItem
            key={category.id}
            icon={<s.Tag className='font-large fg-primary' />}
            onOpen={onOpen(category)}
            onDelete={onDelete(category)}>
            {category.title}
          </v.EntityItem>
        ))}
      </v.EntityItemList>
    )
  }
}

const CategoriesList = connect<CategoriesListStateProps, {}, {}, t.AppState>(state => ({
  categories: state.net.categories.categoryList,
  pending: !fpx.isEmpty(state.net.pending),
}))(_CategoriesList)
