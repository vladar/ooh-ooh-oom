const NUM_PAGES = parseInt(process.env.NUM_PAGES || 1000, 10)
const WEBHOOK_URL = process.env.WEBHOOK_URL || `http://localhost:8000/__refresh`
const INC_BUILD_LIMIT = Number(process.env.INC_BUILD_LIMIT) || 0
const INC_BUILD_NEW_PAGES = Number(process.env.INC_BUILD_NEW_PAGES) || 0
const INC_BUILD_UPDATE_ALL_PAGES = Number(process.env.INC_BUILD_UPDATE_ALL_PAGES) || 0
const template = require(`./page-template`)
const fetch = require(`node-fetch`)

let buildNumber = 0
let totalPages = NUM_PAGES

exports.sourceNodes = ({ actions: { createNode } }) => {
  // Create markdown nodes
  for (let step = 0; step < totalPages; step++) {
    createNode({
      id: step.toString(),
      parent: null,
      children: [],
      internal: {
        type: `FakeMarkdown`,
        mediaType: `text/markdown`,
        content: template(step),
        contentDigest: INC_BUILD_UPDATE_ALL_PAGES ? buildNumber.toString() : step.toString(),
      },
    })
  }
}

exports.createPages = ({ actions: { createPage } }) => {
  for (let step = 0; step < totalPages; step++) {
    createPage({
      path: `/path/${step}/`,
      component: require.resolve(`./src/templates/blank.js`),
      context: {
        id: step.toString(),
      },
    })
  }
}

exports.onPostBuild = async () => {
  if (global.gc) {
    global.gc()
    console.log(`Running GC`)
  }
  console.log(`WEBHOOK_URL: ${WEBHOOK_URL}`)
  console.log(`INC_BUILD_LIMIT: ${INC_BUILD_LIMIT}`)
  console.log(`INC_BUILD_NEW_PAGES: ${INC_BUILD_NEW_PAGES}`)
  console.log(``)

  buildNumber++
  console.log(`CURRENT BUILD: ${buildNumber}`)
  console.log(process.memoryUsage())

  if (buildNumber < INC_BUILD_LIMIT) {
    const okStatuses = [200, 204]
    if (!okStatuses.includes(result.status)) {
      throw new Error(`Unexpected webhook HTTP status: ${result.status}`)
    }
  } else {
    console.log(`REACHED INC_BUILD_LIMIT (${INC_BUILD_LIMIT})`)
    console.log(`TOTAL_PAGES: ${totalPages}`)
  }
  totalPages += INC_BUILD_NEW_PAGES
}
