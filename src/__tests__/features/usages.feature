Feature: Redux Current Usages

###
# Initial rendering scenarios
###

Scenario: Plain selector should render proper text
  Given JSX
    """
    <CurrentProvider name="foo" value="bar">
      <MockTextRC testId="foo-bar" />
    </CurrentProvider>
    """
  When Initially rendering
  Then Content of foo-bar should be "bar"


Scenario: Plain selector should throw outside provider
  Given JSX
    """
   <CurrentProvider name="foo" value="bar" />
   <MockTextRC />
    """
  When Initially rendering
  Then MissingKeyProviderException should be thrown


Scenario: Plain selector in identically named sibling providers should render proper texts
  Given JSX
    """
    <CurrentProvider name="foo" value="bar">
      <MockTextRC testId="foo-bar" />
    </CurrentProvider>
    <CurrentProvider name="foo" value="baz">
      <MockTextRC testId="foo-baz" />
    </CurrentProvider>
    """
  When Initially rendering
  Then Content of foo-bar should be "bar"
    And Content of foo-baz should be "baz"


Scenario: Plain selector in identically named nested providers should render closest values
  Given JSX
    """
    <CurrentProvider name="foo" value="bar">
      <CurrentProvider name="foo" value="ban">
        <MockTextRC testId="foo-ban" />
      </CurrentProvider>
      <MockTextRC testId="foo-bar" />
     </CurrentProvider>
    """
  When Initially rendering
  Then Content of foo-bar should be "bar"
    And Content of foo-ban should be "ban"

###
# Rerendering scenarios
###

Scenario: Plain selector invoked post render should render properly
  Given JSX
    """
    <CurrentProvider name="foo" value="bar">
      {show && <MockTextRC testId="foo-bar" />}
    </CurrentProvider>
    """
  When Initially rendering
    And Rerendering with show=true
  Then Content of foo-bar should be "bar"


Scenario: Plain selector revoked post render should render properly
  Given JSX
    """
    <CurrentProvider name="foo" value="bar">
      {!hide && <MockTextRC testId="foo-bar" />}
    </CurrentProvider>
    """
  When Initially rendering
    And Rerendering with hide=true
  Then Error should not be thrown


Scenario: Plain selector should rerender proper text
  Given JSX
    """
    <CurrentProvider name="foo" value={value}>
      <MockTextRC testId="foo-bar" />
    </CurrentProvider>
    """
  When Initially rendering with value="bar"
    And Rerendering with value="changed-bar"
  Then Content of foo-bar should be "changed-bar"

Scenario: Plain selector in identically named sibling providers should rerender proper texts
  Given JSX
    """
    <CurrentProvider name="foo" value={value}>
      <MockTextRC testId="foo-bar" />
    </CurrentProvider>
    <CurrentProvider name="foo" value="baz">
      <MockTextRC testId="foo-baz" />
    </CurrentProvider>
    """
  When Initially rendering with value="bar"
    And Rerendering with value="bar-new"
  Then Content of foo-bar should be "bar-new"
    And Content of foo-baz should be "baz"


Scenario: Plain selector in identically named nested providers should rerender outer value
  Given JSX
    """
    <CurrentProvider name="foo" value={value}>
      <CurrentProvider name="foo" value="ban">
        <MockTextRC testId="foo-ban" />
      </CurrentProvider>
      <MockTextRC testId="foo-bar" />
     </CurrentProvider>
    """
  When Initially rendering with value="bar"
    And Rerendering with value="bar-new"
  Then Content of foo-bar should be "bar-new"
    And Content of foo-ban should be "ban"


Scenario: Plain selector in identically named nested providers should rerender inner value
  Given JSX
    """
    <CurrentProvider name="foo" value="bar">
      <CurrentProvider name="foo" value={value}>
        <MockTextRC testId="foo-ban" />
      </CurrentProvider>
      <MockTextRC testId="foo-bar" />
     </CurrentProvider>
    """
  When Initially rendering with value="ban"
    And Rerendering with value="ban-new"
  Then Content of foo-bar should be "bar"
    And Content of foo-ban should be "ban-new"


# Multiple contexts
Scenario: Plain selector in differently named nested providers should render matching values
  Given JSX
    """
    <CurrentProvider name="foo" value="bar">
      <CurrentProvider name="fee" value="ban">
        <MockTextRC testId="foo-bar" currentKey="foo" />
        <MockTextRC testId="fee-ban" currentKey="fee" />
      </CurrentProvider>
     </CurrentProvider>
    """
  When Initially rendering
  Then Content of foo-bar should be "bar"
    And Content of fee-ban should be "ban"
