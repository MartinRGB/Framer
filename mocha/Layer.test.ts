import {expect} from "chai"
import {isolated} from "./TestUtils"

import {Layer, Curve, Utils} from "Framer"


describe("Layer", () => {

	isolated.test("should set property on create", (context, done) => {
		const layer = new Layer({x: 500})
		expect(layer.x).to.equal(500)
		done()
	})

	isolated.test("should set property after create", (context, done) => {
		const layer = new Layer()
		layer.x = 500
		expect(layer.x).to.equal(500)
		done()
	})

	isolated.test("should emit change event", (context, done) => {
		const layer = new Layer()
		layer.onChange("x", e => {
			expect(layer.x).to.equal(500)
			done()
		})
		layer.x = 500
	})

	isolated.test("should not emit change event on same value", (context, done) => {
		let counter = 0
		const layer = new Layer()
		layer.onChange("x", e => counter++)

		layer.x = 500
		layer.x = 500
		layer.x = 500
		layer.x = 500

		expect(layer.x).to.equal(500)
		expect(counter).to.equal(1)

		done()
	})

	isolated.test("should have start event", (context, done) => {

		let events: string[] = []

		const layer = new Layer()
		const animation = layer.animate({x: 100}, Curve.linear(0.1))
			.onStart(e => events.push("AnimationStart"))
			.onStop(e => events.push("AnimationStop"))
			.onEnd(e => events.push("AnimationEnd"))
			.onEnd(e => {
				expect(events).to.eql([
					"AnimationStart",
					"AnimationStop",
					"AnimationEnd"])
				done()
			})
	})

	isolated.test("should list animations", (context, done) => {

		const layer = new Layer()
		const animation = layer.animate({x: 100}, Curve.linear(0.1))
			.onStart(e => expect(layer.animations).to.eql([animation]))
			.onStop(e => expect(layer.animations).to.eql([]))
			.onEnd(e => expect(layer.animations).to.eql([]))
			.onEnd(done)

		expect(layer.animations).to.eql([animation])
	})

	isolated.test("should cancel animations on same property", (context, done) => {

		const layer = new Layer()
		const animationA = layer.animate({x: 100}, Curve.linear(0.1))
		const animationB = layer.animate({x: 100}, Curve.linear(0.1))

		expect(animationA.running).to.be.false
		expect(animationB.running).to.be.true
		expect(layer.animations).to.eql([animationB])
		done()
	})

	isolated.test("should not cancel animations on a different property", (context, done) => {

		const layer = new Layer()
		const animationA = layer.animate({x: 100}, Curve.linear(0.1))
		const animationB = layer.animate({y: 100}, Curve.linear(0.1))

		expect(animationA.running).to.be.true
		expect(animationB.running).to.be.true
		expect(layer.animations).to.eql([animationA, animationB])
		done()
	})

	isolated.test("should move between values", (context, done) => {

		const layer = new Layer({x: 100})
		const animationA = layer.animate({x: 200}, Curve.linear(0.1)).onEnd(done)

		context.renderer.loop.on("finish", () => {
			expect(layer.x >= 100).to.be.true
			expect(layer.x <= 200).to.be.true
		})
	})


	isolated.test("should recieve animation events", (context, done) => {

		let events: string[] = []

		const layer = new Layer()

		layer.animate({x: 100}, Curve.linear(0.1))
		layer.onAnimationStart(e => events.push("AnimationStart"))
		layer.onAnimationStop(e => events.push("AnimationStop"))
		layer.onAnimationEnd(e => events.push("AnimationEnd"))

		layer.onAnimationEnd(e => {
			expect(events).to.eql([
				"AnimationStart",
				"AnimationStop",
				"AnimationEnd"])
			done()
		})
	})
})
