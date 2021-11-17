const matter = require(`gray-matter`)

module.exports = index => `
${matter
  .stringify(``, {
    title: `Foo ${index}`,
    slug: `/${index}`,
    [`foo${index}`]: "Bar",
  })
  .trim()}

## Page #${index}

### API

|Name|Description|Required|
|:--:|-----------|--------|
${index}

### More Detail

Lorem Ipsum
`
