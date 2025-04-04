Feature: Redux Current Usages

###
# Initial rendering scenarios
###

Scenario: Hardcoded connectors example
  Given JSX
    """
    <PriceHC testId="price" />
    <TitleHC testId="title" />
    """
  When Initially rendering
  Then Content of price should be "1970 руб."
  Then Content of title should be "Худи сотрудника билайн"


Scenario: Module with simple selector
  Given JSX
    """
    <ProductModule product={selectBeeHoodie}>
      <PriceRC testId="price" />
      <TitleRC testId="title" />
    </ProductModule>
    """
  When Initially rendering
  Then Content of price should be "1970 руб."
  Then Content of title should be "Худи сотрудника билайн"


Scenario: Module with hardcoded selector
  Given JSX
    """
    <ProductModule product={() => beeHoodie}>
      <PriceRC testId="price" />
      <TitleRC testId="title" />
    </ProductModule>
    """
  When Initially rendering
  Then Content of price should be "1970 руб."
  Then Content of title should be "Худи сотрудника билайн"


Scenario: Module with hardcoded value
  Given JSX
    """
    <ProductModule product={beeHoodie}>
      <PriceRC testId="price" />
      <TitleRC testId="title" />
    </ProductModule>
    """
  When Initially rendering
  Then Content of price should be "1970 руб."
  Then Content of title should be "Худи сотрудника билайн"


Scenario: Nested Module with hardcoded value
  Given JSX
    """
    <BundleModule bundle={selectSensationBundle}>
      <BundlePriceRC testId="bundle-price" />
      <BundleTitleRC testId="bundle-title" />
      <ProductModule product={selectBundleProductOne}>
        <PriceRC testId="price" />
        <TitleRC testId="title" />
      </ProductModule>
    </BundleModule>
    """
  When Initially rendering
  Then Content of bundle-price should be "6666 руб."
  Then Content of bundle-title should be "Комплект футболок «Сэнсэйшн б.»"
  Then Content of price should be "2590 руб."
  Then Content of title should be "Футболка с полосами белая"


Scenario: ModuleMapper with hardcoded selector
  Given JSX
    """
    <ProductModule.Mapper product={[beeHoodie]}>
      <PriceRC testId="price" />
      <TitleRC testId="title" />
    </ProductModule.Mapper>
    """
  When Initially rendering
  Then Content of price should be "1970 руб."
  Then Content of title should be "Худи сотрудника билайн"


Scenario: Nested ModuleMapper with selector value
  Given JSX
    """
    <BundleModule bundle={selectSensationBundle}>
      <BundlePriceRC testId="bundle-price" />
      <BundleTitleRC testId="bundle-title" />
      <ProductModule.Mapper product={selectBundleProductsList}>
        <PriceRC testId="price" />
        <TitleRC testId="title" />
      </ProductModule.Mapper>
    </BundleModule>
    """
  When Initially rendering
  Then Content of bundle-price should be "6666 руб."




#Scenario: ModuleRC with hardcoded value
#  Given JSX
#    """
#    <ProductModuleRC
#      product={beeHoodie}
#      priceTestId="price"
#      titleTestId="title"
#    />
#    """
#  When Initially rendering
#  Then Content of price should be "1970 руб."
#  Then Content of title should be "Худи сотрудника билайн"
#
#
#Scenario: Nested ModuleRC with hardcoded value
#  Given JSX
#    """
#    <BundleModule bundle={selectSensationBundle}>
#      <BundlePriceRC testId="bundle-price" />
#      <BundleTitleRC testId="bundle-title" />
#      <ProductModuleRC
#        product={selectBundleProductOne}
#        priceTestId="price"
#        titleTestId="title"
#      />
#    </BundleModule>
#    """
#  When Initially rendering
#  Then Content of bundle-price should be "6666 руб."
#  Then Content of bundle-title should be "Комплект футболок «Сэнсэйшн б.»"
#  Then Content of price should be "2590 руб."
#  Then Content of title should be "Футболка с полосами белая"
#
#
#Scenario: ModuleMapperRC with hardcoded selector
#  Given JSX
#    """
#    <ProductModuleRC.Mapper
#      product={[beeHoodie]}
#      priceTestId="price"
#      titleTestId="title"
#    />
#    """
#  When Initially rendering
#  Then Contents of price should be ["1970 руб."]
#  Then Contents of title should be ["Худи сотрудника билайн"]
#
#
#Scenario: Nested ModuleMapperRC with selector value
#  Given JSX
#    """
#    <BundleModule bundle={selectSensationBundle}>
#      <BundlePriceRC testId="bundle-price" />
#      <BundleTitleRC testId="bundle-title" />
#      <ProductModuleRC.Mapper
#        product={selectBundleProductsList}
#        priceTestId="price"
#        titleTestId="title"
#      />
#    </BundleModule>
#    """
#  When Initially rendering
#  Then Contents of price should be ["2590 руб.", "2390 руб.", "2399 руб."]
#  Then Contents of title should be ["Футболка с полосами белая", "Футболка с логотипом билайна, белая", "Футболка «б.» унисекс белая, размер M"]
