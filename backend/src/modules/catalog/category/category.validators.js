import {
  mongoIdRules,
  searchRule,
  isActiveRule,
  paginationRules,
  resourceNameRules,
  descriptionRule,
} from "#utils/validators.js";

const categoryName = resourceNameRules("Category name");

export const listRules = [searchRule, isActiveRule, ...paginationRules];

export const getRules = [mongoIdRules()];

export const createRules = [categoryName.required, descriptionRule];

export const updateRules = [mongoIdRules(), categoryName.optional, descriptionRule];

export const toggleActiveRules = [mongoIdRules()];
