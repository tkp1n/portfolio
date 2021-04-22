export default class CommentRepository {
    #endpoint;
    #sharedAccessSignature

    constructor(endpoint, sharedAccessSignature) {
        this.#endpoint = endpoint;
        this.#sharedAccessSignature = sharedAccessSignature;
    }

    async top(url, n) {
        const collected = [];
        const parameters = {
            $top: n,
            $filter: `PartitionKey eq '${url}'`
        };

        let remaining = n;
        while (remaining > 0) {
            const result = await fetch(this.url(parameters), {
                headers: {
                    'Accept': 'application/json;odata=nometadata'
                }
            });

            const data = (await result.json()).value;
            collected.push(...data.map(CommentRepository.#map).slice(0, remaining));

            parameters.NextPartitionKey = result.headers['x-ms-continuation-NextPartitionKey'];
            parameters.NextRowKey = result.headers['x-ms-continuation-NextRowKey'];

            remaining = n - collected.length;
        }

        return collected;
    }

    url(params) {
        const para = Object.entries(params)
            .map(([key, val]) => `${key}=${val}`)
            .join('&');

        return `${this.#endpoint}/comments?${this.#sharedAccessSignature}&${para}`;
    }

    static #map(value) {
        return {
            PostUrl: value.PartitionKey,
            CreationDate: new Date(Number.parseInt(value.RowKey)),
            Timestamp: value.Timestamp,
            Author: value.Author,
            Content: value.Content
        };
    }
};