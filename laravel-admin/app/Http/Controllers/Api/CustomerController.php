<?php
// app/Http/Controllers/CustomerController.php
namespace App\Http\Controllers\api;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    public function index()
    {
        return response()->json(
            Customer::orderBy('id','desc')->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:customers',
            'phone' => 'nullable|string',
            'status'=> 'boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('customers', 'public');
        }

        $customer = Customer::create($validated);

        return response()->json(['message' => 'Customer created successfully', 'customer' => $customer], 201);
    }

    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'phone' => 'nullable|string',
            'status'=> 'boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($customer->image) {
                Storage::disk('public')->delete($customer->image);
            }
            $validated['image'] = $request->file('image')->store('customers', 'public');
        }

        $customer->update($validated);

        return response()->json(['message' => 'Customer updated successfully', 'customer' => $customer]);
    }

    public function destroy(Customer $customer)
    {
        if ($customer->image) {
            Storage::disk('public')->delete($customer->image);
        }

        $customer->delete();
        return response()->json(['message' => 'Customer deleted successfully']);
    }

    // Toggle status
    public function toggleStatus(Customer $customer)
    {
        $customer->status = !$customer->status;
        $customer->save();

        return response()->json(['message' => 'Status updated', 'status' => $customer->status]);
    }
}
