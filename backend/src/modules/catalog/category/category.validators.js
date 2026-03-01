import {
  paramIdRules,
  searchRule,
  isActiveRule,
  paginationRules,
  resourceNameRules,
  descriptionRule,
} from "#utils/validators.js";

const categoryName = resourceNameRules("Category name");

export const listRules = [searchRule, isActiveRule, ...paginationRules];

export const getRules = [paramIdRules()];

export const createRules = [categoryName.required, descriptionRule];

export const updateRules = [paramIdRules(), categoryName.optional, descriptionRule];

export const toggleActiveRules = [paramIdRules()];
