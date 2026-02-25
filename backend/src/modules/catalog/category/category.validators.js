import {
  mongoIdRules,
  searchRule,
  isActiveRule,
  paginationRules,
  resourceNameRules,
  descriptionRule,
} from "#utils/validators.js";

const categoryName = resourceNameRules("Category name");

export const listCategoriesRules = [searchRule, isActiveRule, ...paginationRules];

export const getCategoryRules = [mongoIdRules()];

export const createCategoryRules = [categoryName.required, descriptionRule];

export const updateCategoryRules = [mongoIdRules(), categoryName.optional, descriptionRule];

export const toggleActiveRules = [mongoIdRules()];
