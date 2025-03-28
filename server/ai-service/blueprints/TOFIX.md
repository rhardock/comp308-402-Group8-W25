## What are some things we need to fix in `/blueprints`?
- [ ] `summrize.py` and `generate.py` have a bit of code duplication, such duplication should be avoided.
  - We could create a `utils.py` file and move the common code there.
  - We could also consider defining a .yaml file with the common parameters.
  - We have to follow the DRY principle.
- [ ] Documentation for all blueprints are not missing, we should incorporate documentation.
  - We could use the `docstring` to document the blueprints.
  - We could also setup swagger for the blueprints.